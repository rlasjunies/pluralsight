var indexFormulaire = (function () {
    function indexFormulaire() {
    }
    return indexFormulaire;
})();

function index(req, res) {
    //res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    //res.header("Pragma", "no-cache");
    //res.header("Expires", 0);
    var param = new indexFormulaire();
    param.titletest = "valueDeTitleTestModifié";
    res.render('index', param);
}
exports.index = index;
;
//# sourceMappingURL=index.js.map
