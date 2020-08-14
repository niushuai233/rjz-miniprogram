import http from './fly'

// export const getIndex = params => { return http.get('/index/', params)};

// 获取分类列表
export const getCategoryList = params => {
  return http.post('/bill/category/billCategoryList', params)
};
// export const getCategoryList2 = params => {
//   return http.post('/accounting/getCategoryList', params)
// };

// 新增记账分类
export const addCategory = params => {
  return http.post('/bill/category/addBillCategory', params)
};
// export const addCategory2 = params => {
//   return http.post('/accounting/addCategory', params)
// };

// 更新记账分类
export const updateCategoryList = params => {
  return http.post('/accounting/updateCategoryList', params)
};

// 删除记账分类
export const deleteCategory = params => {
  return http.post('/bill/category/deleteBillCategory', params)
};

// 获取记账列表
export const getAccountingList = params => {
  return http.post('/bill/note/billNoteList', params)
};
export const getAccountingList2 = params => {return http.post('/accounting/getAccountingList', params)};


// 获取记账总和 （月度和年度）
export const getAmount = params => {
  return http.post('/accounting/getAmount', params)
};

// 新增记账记录
export const addRecord = params => {
  return http.post('/bill/note/addBillNote', params)
};

// deleteAccounting
export const deleteAccounting = params => {
  return http.post('/bill/note/deleteBillNote', params)
};
