import {requireValue as need} from '../../vendor/project-store.ts';
import {digest,find,ordered,unique,checkNotes} from './shared.ts';
export const units=(text:string)=>text.match(/[\p{L}\p{N}]/gu)??[];
export const lineDigest=(line:any)=>digest(line);
export function poemLines(p:any,id:string){find(p.poems,id,'诗篇');return ordered(p.stanzas.filter((s:any)=>s.poem_id===id)).flatMap(s=>ordered(p.lines.filter((l:any)=>l.stanza_id===s.id)));}
export function target(p:any,kind:string,id:string){if(kind==='line')return find(p.lines,id,'诗行');if(kind==='poem')return {...find(p.poems,id,'诗篇'),lines:poemLines(p,id)};throw Error('未知意见目标。');}
export const targetDigest=(p:any,kind:string,id:string)=>digest(target(p,kind,id));
export function validatePoetry(p:any){
 unique(p.poems.map((x:any)=>x.order),'诗篇顺序重复。');
 for(const poem of p.poems){need(poem.title.trim(),'诗篇标题不能为空。');if(poem.form==='declared')need(poem.profile_id!==null,'声明形式须指定规则。');else need(poem.profile_id===null,'自由诗不隐含格律规则。');if(poem.profile_id!==null)find(p.profiles,poem.profile_id,'规则');unique(p.stanzas.filter((s:any)=>s.poem_id===poem.id).map((s:any)=>s.order),'同诗诗节顺序重复。');}
 for(const stanza of p.stanzas){find(p.poems,stanza.poem_id,'诗篇');unique(p.lines.filter((l:any)=>l.stanza_id===stanza.id).map((l:any)=>l.order),'同节诗行顺序重复。');}
 for(const line of p.lines){find(p.stanzas,line.stanza_id,'诗节');need(line.text.trim()&&!/[\r\n]/.test(line.text),'诗行必须是非空单行。');unique(line.readings.map((r:any)=>r.position),'同一字位读音重复。');const chars=units(line.text);for(const r of line.readings){need(chars[r.position-1]===r.unit,'读音字位与当前原字不一致。');need(r.reading!==null||r.tone==='?'&&r.rhyme_key===null,'平仄或韵尾须有明确读音依据。');}}
 for(const profile of p.profiles){unique(profile.rules.map((x:any)=>x.line_no),'规则句号重复。');for(const rule of profile.rules)need(rule.units===null||!rule.tones.length||rule.tones.length===rule.units,'平仄模式长度与声明字数不一致。');}
 for(const v of p.variants)find(p.lines,v.line_id,'备选原句');for(const x of p.imports)find(p.poems,x.poem_id,'导入诗篇');checkNotes(p,(kind,id)=>target(p,kind,id));
}
export function scanPoem(p:any,id:string){
 const poem=find(p.poems,id,'诗篇'),rows=poemLines(p,id),profile=poem.profile_id===null?null:find(p.profiles,poem.profile_id,'规则');
 const lines=rows.map((line:any,index:number)=>{const chars=units(line.text),rule=profile?.rules.find((r:any)=>r.line_no===index+1);const mismatches:any[]=[],unknown:number[]=[];
  for(const [n,expected] of [...(rule?.tones??'')].entries()){if(expected==='*')continue;const actual=line.readings.find((r:any)=>r.position===n+1)?.tone??'?';if(actual==='?')unknown.push(n+1);else if(actual!==expected)mismatches.push({position:n+1,expected,actual});}
  return {id:line.id,text:line.text,line_no:index+1,units:chars.length,expected_units:rule?.units??null,length_ok:rule?.units==null||chars.length===rule.units,pattern:rule?.tones??'',declared_tones:chars.map((_,n)=>line.readings.find((r:any)=>r.position===n+1)?.tone??'?').join(''),unknown_positions:unknown,mismatches,rhyme_group:rule?.rhyme_group??null,rhyme_key:line.readings.find((r:any)=>r.position===chars.length)?.rhyme_key??null,rule_missing:profile!==null&&!rule};});
 const groups=[...new Set(lines.map(l=>l.rhyme_group).filter(Boolean))].map(group=>{const ls=lines.filter(l=>l.rhyme_group===group);return {group,line_ids:ls.map(l=>l.id),keys:ls.map(l=>l.rhyme_key),status:ls.some(l=>l.rhyme_key===null)?'unknown':ls.length<2?'single':new Set(ls.map(l=>l.rhyme_key)).size===1?'declared_match':'declared_conflict'};});
 const issues=lines.some(l=>!l.length_ok||l.mismatches.length||l.rule_missing)||groups.some(g=>g.status==='declared_conflict')||(profile!==null&&profile.rules.length!==lines.length),unknown=lines.some(l=>l.unknown_positions.length)||groups.some(g=>g.status==='unknown');
 return {poem,profile,lines,groups,status:!profile?'free_form':issues?'issues':unknown?'unknown':'matches_declared',rule_count_matches:profile===null||profile.rules.length===lines.length,note:'只核对明确体系和声明规则，不认证诗意、传统整诗或听觉效果。'};
}
export function checkPoetry(p:any){return {poems:p.poems.map((x:any)=>scanPoem(p,x.id)),empty_poem_ids:p.poems.filter((x:any)=>!poemLines(p,x.id).length).map((x:any)=>x.id),stale_variant_ids:p.variants.filter((v:any)=>v.line_sha256!==lineDigest(find(p.lines,v.line_id))).map((v:any)=>v.id),stale_note_ids:p.notes.filter((n:any)=>n.target_sha256!==targetDigest(p,n.target_kind,n.target_id)).map((n:any)=>n.id)};}
export function parsePoem(text:string){need(Buffer.byteLength(text)<=65536,'原诗超过64KiB，请按诗篇分开。');need(text.trim(),'原诗不能为空。');const groups=text.replace(/\r\n?/g,'\n').split(/\n[\t ]*\n/).map(g=>g.split('\n').filter(l=>l.trim()));return {stanzas:groups.filter(g=>g.length),source_text:text,losses:['纯文本按换行和空行分节，不推断标题、格律、音韵或用典。']};}
export function poetryText(p:any){return ordered(p.poems).map(poem=>'# '+poem.title+'\n\n'+ordered(p.stanzas.filter((s:any)=>s.poem_id===poem.id)).map(s=>ordered(p.lines.filter((l:any)=>l.stanza_id===s.id)).map(l=>l.text).join('\n')).join('\n\n')).join('\n\n')+'\n';}
