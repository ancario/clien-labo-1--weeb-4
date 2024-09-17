const API_URL = "http://localhost:5000/api/bookmark";

// Récupérer tous les bookmarks
function API_GetBookmarks() {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL,
            success: bookmarks => { resolve(bookmarks); },
            error: (xhr) => { console.log(xhr); resolve(null); }
        });
    });
}

// Récupérer un bookmark spécifique par ID
function API_GetBookmark(bookmarkId) {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "/" + bookmarkId,
            success: bookmark => { resolve(bookmark); },
            error: () => { resolve(null); }
        });
    });
}

// Sauvegarder un nouveau bookmark ou mettre à jour un existant
function API_SaveBookmark(bookmark, create) {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + (create ? "" : "/" + bookmark.Id),
            type: create ? "POST" : "PUT",
            contentType: 'application/json',
            data: JSON.stringify(bookmark),
            success: (/*data*/) => { resolve(true); },
            error: (/*xhr*/) => { resolve(false /*xhr.status*/); }
        });
    });
}

// Supprimer un bookmark par ID
function API_DeleteBookmark(id) {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "/" + id,
            type: "DELETE",
            success: () => { resolve(true); },
            error: (/*xhr*/) => { resolve(false /*xhr.status*/); }
        });
    });
}
let selectedCategory = "";
function updateDropDownMenu(categories) {
let DDMenu = $("#DDMenu");
let selectClass = selectedCategory === "" ? "fa-check" : "fa-fw";
DDMenu.empty();
DDMenu.append($(`
<div class="dropdown-item menuItemLayout" id="allCatCmd">
<i class="menuIcon fa ${selectClass} mx-2"></i> Toutes les catégories
</div>
`));
DDMenu.append($(`<div class="dropdown-divider"></div>`));
categories.forEach(category => {
selectClass = selectedCategory === category ? "fa-check" : "fa-fw";
DDMenu.append($(`
<div class="dropdown-item menuItemLayout category" id="allCatCmd">
<i class="menuIcon fa ${selectClass} mx-2"></i> ${category}
</div>
`));
})
DDMenu.append($(`<div class="dropdown-divider"></div> `));
DDMenu.append($(`
<div class="dropdown-item menuItemLayout" id="aboutCmd">
<i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
</div>
`));
$('#aboutCmd').on("click", function () {
renderAbout();
});
$('#allCatCmd').on("click", function () {
selectedCategory = "";
renderBookmarks();
});
$('.category').on("click", function () {
selectedCategory = $(this).text().trim();
renderBookmarks();
});
}