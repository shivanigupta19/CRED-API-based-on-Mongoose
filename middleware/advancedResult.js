const advancedResult = (model , populate ) => async(req,res,next) =>{
    let query;
    // Copy req.query
    const reqQuery = {...req.query};
    // Field to execute
    const removeFields = ['select','sort','page','limit'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(params => delete reqQuery[params]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt,$gte,etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
    console.log(queryStr);
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        console.log(fields);
        query = query.select(fields);
    }
    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments;
    query = query.skip(startIndex).limit(limit);
    if(populate){
        query = query.populate(populate);

    }
 
    // Executing  query
    const results = await query;
    // Pagination Results
    const pagination = {};
    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
    }
    if(startIndex > 0){
        pagination.prev = {
            page : page - 1,
            limit
        }
    }
    res.advancedResult = {
        success : true,
        count : results.length,
        pagination,
        data : results
    }
    next();
};
module.exports = advancedResult;