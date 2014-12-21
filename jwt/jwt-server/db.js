var mongoose = require("mongoose");
var db = (function () {
    function db() {
        //try {
        mongoose.connect('mongodb://localhost/psjwt', function (err) {
            if (err) {
                throw err;
            }
            console.log("mongodb connected!");
        });
        ////    console.log("mongodb connected!");
        //} catch (err) {
        //    if (err) {
        //        throw err;
        //    }
        //}        
    }
    db.prototype.disconnect = function () {
        mongoose.disconnect();
    };
    return db;
})();
exports.db = db;
//# sourceMappingURL=db.js.map