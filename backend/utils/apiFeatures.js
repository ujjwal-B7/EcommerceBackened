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
  
}
module.exports = ApiFeatures;
