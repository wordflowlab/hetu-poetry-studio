import {requireValue as need} from '../../vendor/project-store.ts';
import {find,ordered,fixedHistory,digest} from './shared.ts';
import {artifact,hash} from './artifact.ts';
import {sourceText} from './text.ts';
import {validatePoetry,scanPoem,checkPoetry,lineDigest,targetDigest,parsePoem,poetryText,poemLines} from './poetry.ts';
export const validateDomain=validatePoetry;
export function validateTransition(next:any,prev:any,..._rest:any[]){fixedHistory(next,prev,['imports']);}
export async function checkSources(p:any,s:any[],..._rest:any[]){for(const i of p.imports){need(hash(i.source_text)===i.sha256&&sourceText(s[i.source_index])===i.source_text,'导入原件与固定来源不一致。');}}
export async function pureAction(_a:string,_i:any){return undefined;}
export async function writeProfessional(a:string,p:any,s:any[],i:any,..._rest:any[]){
 if(a==='apply_variant'){const v=find(p.variants,i.variant_id,'备选'),line=find(p.lines,v.line_id,'原句');need(lineDigest(line)===v.line_sha256,'备选原句依据已变化。','hetu.stale_evidence');line.text=v.text;line.readings=[];return;}
 if(a==='import_poem'){need(!p.poems.some((v:any)=>v.id===i.poem_id),'诗篇ID已存在。');const raw=sourceText(s[i.source_index]),parsed=parsePoem(raw),prefix=hash(i.import_id).slice(0,16);p.poems.push({id:i.poem_id,title:i.title,order:i.order,form:'free',profile_id:null,intent:''});for(const [n,lines] of parsed.stanzas.entries()){const sid='s-'+prefix+'-'+n;p.stanzas.push({id:sid,poem_id:i.poem_id,title:'',order:n+1});for(const [k,text] of lines.entries())p.lines.push({id:'l-'+prefix+'-'+n+'-'+k,stanza_id:sid,order:k+1,text,readings:[],ranges:[]});}p.imports.push({id:i.import_id,poem_id:i.poem_id,source_index:i.source_index,source_text:raw,sha256:hash(raw)});return;}
 throw Error('未实现的专业写动作。');
}
export function summaries(p:any){return [{title:'创作目标',lines:[p.brief]},{title:'完整诗集',lines:[poetryText(p)]},{title:'形式与规则',lines:p.poems.map((x:any)=>{const s=scanPoem(p,x.id);return x.title+'：'+s.status+'；'+(s.profile?.source_note??'自由诗，无强制规则');})},{title:'逐句备选',lines:p.variants.map((v:any)=>find(p.lines,v.line_id).text+' → '+v.text+'；'+v.rationale)},{title:'用典依据',lines:p.lines.flatMap((l:any)=>l.ranges.map((r:any)=>r.quote))},{title:'固定意见',lines:p.notes.map((n:any)=>n.comment+'；'+n.status+' '+n.resolution)}];}
export async function readProfessional(a:string,p:any,s:any[],i:any,..._rest:any[]){
 if(a==='check_poetry')return checkPoetry(p);if(a==='scan_poem')return scanPoem(p,i.poem_id);if(a==='line_digest'){const line=find(p.lines,i.line_id);return {line,line_sha256:lineDigest(line)};}
 if(a==='target_digest')return {target_sha256:targetDigest(p,i.target_kind,i.target_id)};
 if(a==='profile_report')return {profiles:p.profiles,note:'声明体系及来源不是完整韵书认证。'};
 if(a==='collection_order')return {poems:ordered(p.poems).map(x=>({...x,line_ids:poemLines(p,x.id).map((l:any)=>l.id)}))};
 if(a==='preview_poem')return parsePoem(sourceText(s[i.source_index]));
 if(a==='export_reading')return artifact(poetryText(p),'诗集阅读本.txt','text/plain',i);
 if(a==='export_review'){const {reportHTML}=await import('./report.ts');return artifact(reportHTML({project:p}),'诗词审核本.html','text/html',i);}
}
