import re

with open('src/educational/curriculumData.ts', 'r', encoding='utf-8') as f:
    code = f.read()

level_updates = {
  8: (175, ['q_spec_01', 'q_spec_02', 'q_spec_03', 'q_spec_04', 'q_spec_05']),
  9: (175, ['q_range_01', 'q_range_02', 'q_range_03', 'q_range_04', 'q_range_05']),
  10: (175, ['q_arith_01', 'q_arith_02', 'q_arith_03', 'q_arith_04', 'q_arith_05']),
  11: (180, ['q_ufunc_01', 'q_ufunc_02', 'q_ufunc_03', 'q_ufunc_04', 'q_ufunc_05']),
  12: (180, ['q_agg_01', 'q_agg_02', 'q_agg_03', 'q_agg_04', 'q_agg_05']),
  13: (185, ['q_axis_01', 'q_axis_02', 'q_axis_03', 'q_axis_04', 'q_axis_05']),
  14: (180, ['q_comp_01', 'q_comp_02', 'q_comp_03', 'q_comp_04', 'q_comp_05']),
  15: (185, ['q_bool_01', 'q_bool_02', 'q_bool_03', 'q_bool_04', 'q_bool_05']),
  16: (185, ['q_where_01', 'q_where_02', 'q_where_03', 'q_where_04', 'q_where_05']),
  17: (185, ['q_cond_01', 'q_cond_02', 'q_cond_03', 'q_cond_04', 'q_cond_05']),
  18: (190, ['q_bcast_01', 'q_bcast_02', 'q_bcast_03', 'q_bcast_04', 'q_bcast_05']),
  19: (190, ['q_bcast_rules_01', 'q_bcast_rules_02', 'q_bcast_rules_03', 'q_bcast_rules_04', 'q_bcast_rules_05']),
  20: (220, ['q_bcast_boss_01', 'q_bcast_boss_02', 'q_bcast_boss_03', 'q_bcast_boss_04', 'q_bcast_01', 'q_bcast_rules_01']),
  21: (180, ['q_concat_01', 'q_concat_02', 'q_concat_03', 'q_concat_04', 'q_concat_05']),
  22: (180, ['q_stack_01', 'q_stack_02', 'q_stack_03', 'q_stack_04', 'q_stack_05']),
  23: (180, ['q_vhstack_01', 'q_vhstack_02', 'q_vhstack_03', 'q_vhstack_04', 'q_vhstack_05']),
  24: (180, ['q_split_01', 'q_split_02', 'q_split_03', 'q_split_04', 'q_split_05']),
  25: (185, ['q_sort_01', 'q_sort_02', 'q_sort_03', 'q_sort_04', 'q_sort_05']),
  26: (185, ['q_copyview_01', 'q_copyview_02', 'q_copyview_03', 'q_copyview_04', 'q_copyview_05']),
  27: (185, ['q_trans_01', 'q_trans_02', 'q_trans_03', 'q_trans_04', 'q_trans_05']),
  28: (185, ['q_advshape_01', 'q_advshape_02', 'q_advshape_03', 'q_advshape_04', 'q_advshape_05']),
  29: (185, ['q_rand_01', 'q_rand_02', 'q_rand_03', 'q_rand_04', 'q_rand_05']),
  30: (185, ['q_randdata_01', 'q_randdata_02', 'q_randdata_03', 'q_randdata_04', 'q_randdata_05']),
  31: (185, ['q_matops_01', 'q_matops_02', 'q_matops_03', 'q_matops_04', 'q_matops_05']),
  32: (185, ['q_dot_01', 'q_dot_02', 'q_dot_03', 'q_dot_04', 'q_dot_05']),
  33: (190, ['q_linalg_01', 'q_linalg_02', 'q_linalg_03', 'q_linalg_04', 'q_linalg_05']),
  34: (185, ['q_nan_01', 'q_nan_02', 'q_nan_03', 'q_nan_04', 'q_nan_05']),
  35: (185, ['q_miss_01', 'q_miss_02', 'q_miss_03', 'q_miss_04', 'q_miss_05']),
  36: (190, ['q_dataset_01', 'q_dataset_02', 'q_dataset_03', 'q_dataset_04', 'q_dataset_05']),
  37: (190, ['q_vec_01', 'q_vec_02', 'q_vec_03', 'q_vec_04', 'q_vec_05']),
  38: (190, ['q_perf_01', 'q_perf_02', 'q_perf_03', 'q_perf_04', 'q_perf_05']),
  39: (195, ['q_advidx_01', 'q_advidx_02', 'q_advidx_03', 'q_advidx_04', 'q_advidx_05']),
  40: (195, ['q_dim_01', 'q_dim_02', 'q_dim_03', 'q_dim_04', 'q_dim_05']),
  41: (195, ['q_algo_01', 'q_algo_02', 'q_algo_03', 'q_algo_04', 'q_algo_05']),
}

for lvl, (hp, qids) in level_updates.items():
    qids_str = ', '.join(["'" + q + "'" for q in qids])
    pattern = rf'(id:\s*{lvl}\b[\s\S]*?monster:\s*\{{[\s\S]*?hp:\s*)\d+(\b[\s\S]*?maxHp:\s*)\d+([\s\S]*?questionIds:\s*)\[[^\]]*\]'
    def repl(m, target_hp=hp, target_qids=qids_str):
        return f'{m.group(1)}{target_hp}{m.group(2)}{target_hp}{m.group(3)}[{target_qids}]'
    new_code, count = re.subn(pattern, repl, code, count=1)
    if count > 0:
        code = new_code
        print(f'Successfully updated Level {lvl}: HP {hp}, {len(qids)} questions')
    else:
        print(f'FAILED to match Level {lvl}')

with open('src/educational/curriculumData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done writing curriculumData.ts!')
