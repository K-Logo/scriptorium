/**
 * TODO: 
 *  - GET api/admin         (likely needs custom pagination due to response format)
 *  - GET api/blog/searchBlogs
 *  - GET api/blog/sortBlogs
 *  - GET api/users/[userID] (get all of userID's codetemplates)
 *  - GET api/codetemplates
 *  - GET api/comments/sortComments
 * 
 * 
 * Requirements:
 * Request:
 *  - entries per page (1<=i<=30)
 *  - which page (>=1; if not enough entries for page j, return empty array)
 * Response:
 *  - Number of entries found
 *  - data
 * 
 * if entriespp unspecified, assume 20 entries. If pageno unspecified, assume page 1.
 */

// Paginate array A. Returns null on failure
export function paginate(epp, pno, A) {
  try {
    if (!A) {
      return [A,0,0];
    }
  
    let accEpp = 20;
    let accPno = 1;
  
    if (typeof epp !== 'undefined' && epp !== null) {
      epp = parseInt(epp);
      if (epp < 1 || epp > 30) return null;  // entries per page out of range. specify 1-30.
      accEpp = epp;
    }
    if (typeof pno !== 'undefined' && pno !== null) {
      pno = parseInt(pno);
      if (pno < 1) return null;  // target page number out of range. specify at least 1
      accPno = pno;
    }
  
    const R = A.slice((accPno - 1) * accEpp, accPno * accEpp);
    return [R, accPno, R.length];
  } catch (e) {
    return null;  // something failed... debug me
  }
}