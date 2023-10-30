const ErrorHandler = require("./errorHandler");

// features for search,filter,pagination and other
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // searching the product
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // filtering the products
  filter() {
    const copyQuery = { ...this.queryStr };
    //removing keyword because it is part of search function above
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete copyQuery[key]);

    //filter for price range
    let queryStr = JSON.stringify(copyQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // pagination func
  pagination(productPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skipProduct = productPerPage * (currentPage - 1);
    this.query = this.query.limit(productPerPage).skip(skipProduct);
    return this;
  }
}
module.exports = ApiFeatures;
