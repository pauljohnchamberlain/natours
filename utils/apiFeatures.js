class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt'); // default sorting
    }
    return this;
  }

  limitFields() {
    // 2) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // select('name duration price')
    } else {
      this.query = this.query.select('-__v'); // default field
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString * 1 || 1; // multiply by 1 to convert to a number || default page (number 1 in this case)
    const limit = this.queryString * 1 || 100; // default limit (100 in this case)
    const skip = (page - 1) * limit; // page 1: 1-10, page 2: 11-20, page 3: 21-30, etc.

    this.query = this.query.skip(skip).limit(limit); // 10 on a page and skip the first 10 results

    return this;
  }
}

module.exports = APIFeatures;
