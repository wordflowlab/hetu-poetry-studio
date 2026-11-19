# 诗词工坊功能清单

本包拥有专业能力；宿主拥有正文、来源与作者决定。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找歌词工程 |  | read |
| get_project | 读取固定歌词工程 | object_id | read |
| save_project | 保存完整歌词工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| get_source | 分块读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定歌词修订 | object_id, from_revision, to_revision | read |
| export_project | 分块导出完整歌词数据 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备本工程AI接续 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
| put_poem | 维护诗篇 | object_id, expected_revision, expected_sha256, operation_key, poem | managed_write |
| remove_poem | 移除诗篇 | object_id, expected_revision, expected_sha256, operation_key, poem_id | managed_write |
| put_stanza | 维护诗节 | object_id, expected_revision, expected_sha256, operation_key, stanza | managed_write |
| remove_stanza | 移除诗节 | object_id, expected_revision, expected_sha256, operation_key, stanza_id | managed_write |
| put_line | 维护诗行 | object_id, expected_revision, expected_sha256, operation_key, line | managed_write |
| remove_line | 移除诗行 | object_id, expected_revision, expected_sha256, operation_key, line_id | managed_write |
| put_profile | 维护明确规则 | object_id, expected_revision, expected_sha256, operation_key, profile | managed_write |
| remove_profile | 移除明确规则 | object_id, expected_revision, expected_sha256, operation_key, profile_id | managed_write |
| put_variant | 维护逐句备选 | object_id, expected_revision, expected_sha256, operation_key, variant | managed_write |
| remove_variant | 移除逐句备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| put_note | 维护固定意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除固定意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| target_digest | 读取固定目标摘要 | object_id, target_kind, target_id | read |
| check_poetry | 检查诗集缺口 | object_id | read |
| profile_report | 读取声明规则 | object_id | read |
| collection_order | 读取诗集顺序 | object_id | read |
| scan_poem | 核对声明音韵与形式 | object_id, poem_id | read |
| line_digest | 读取固定诗行摘要 | object_id, line_id | read |
| apply_variant | 使用固定逐句备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| preview_poem | 预览固定原诗分节 | object_id, source_index | read |
| import_poem | 追加固定原诗与原件 | object_id, expected_revision, expected_sha256, operation_key, source_index, poem_id, import_id, title, order | managed_write |
| export_reading | 导出专业阅读本 | object_id | read |
| export_review | 导出完整专业审核本 | object_id | read |

默认流程、边界及验收见 [docs](docs/README.md)。
