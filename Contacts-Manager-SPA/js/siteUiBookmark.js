    // <span class="cmdIcon fa-solid fa-ellipsis-vertical"></span>
    let contentScrollPosition = 0;
    Init_UI();

    function Init_UI() {
        renderBookmarks();
        $('#createBookmark').on("click", async function () {
            saveContentScrollPosition();
            renderCreateBookmarkForm();
        });
        $('#abort').on("click", async function () {
            renderBookmarks();
        });
        $('#aboutCmd').on("click", function () {
            renderAbout();
        });
    }

    function renderAbout() {
        saveContentScrollPosition();
        eraseContent();
        $("#createBookmark").hide();
        $("#abort").show();
        $("#actionTitle").text("À propos...");
        $("#content").append(
            $(`  
                <div class="aboutContainer">
                    <h2>Gestionnaire de bookmarks</h2>
                    <hr>
                    <p>
                        labo 1
                    </p>
                    <p>
                        Auteur: anthony labbe
                    </p>
                    <p>
                        Collège Lionel-Groulx, automne 2024
                    </p>
                </div>
            `))
    }
    async function API_GetCategories( bookmarks) {
       
      
      
        let categories = bookmarks.map(bookmark => bookmark.Category);
    
       
        categories = [...new Set(categories)];
    
        return categories;
    }
    async function renderBookmarks() {
        showWaitingGif();
        $("#actionTitle").text("Liste des bookmarks");
        $("#createBookmark").show();
        $("#abort").hide();
        
        
        let bookmarks = await API_GetBookmarks();
        let categories = await API_GetCategories(bookmarks); 
    
        
        updateDropDownMenu(categories);
        
        eraseContent();
    
        if (bookmarks !== null) {
          
            if (selectedCategory !== "") {
                bookmarks = bookmarks.filter(bookmark => bookmark.Category === selectedCategory);
            }
    
        
            if (bookmarks.length > 0) {
                bookmarks.forEach(bookmark => {
                    $("#content").append(renderBookmark(bookmark));
                });
            } else {
                $("#content").append("<p>Aucun bookmark trouvé dans cette catégorie.</p>");
            }
    
            restoreContentScrollPosition();
    
          
            $(".editCmd").on("click", function () {
                saveContentScrollPosition();
                renderEditBookmarkForm(parseInt($(this).attr("editBookmarkId")));
            });
            $(".deleteCmd").on("click", function () {
                saveContentScrollPosition();
                renderDeleteBookmarkForm(parseInt($(this).attr("deleteBookmarkId")));
            });
            $(".bookmarkRow").on("click", function (e) { e.preventDefault(); })
        } else {
            renderError("Service introuvable");
        }
    }

    function showWaitingGif() {
        $("#content").empty();
        $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
    }

    function eraseContent() {
        $("#content").empty();
    }

    function saveContentScrollPosition() {
        contentScrollPosition = $("#content")[0].scrollTop;
    }

    function restoreContentScrollPosition() {
        $("#content")[0].scrollTop = contentScrollPosition;
    }

    function renderError(message) {
        eraseContent();
        $("#content").append(
            $(`  
                <div class="errorContainer">
                    ${message}
                </div>
            `)
        );
    }

    function renderCreateBookmarkForm() {
        renderBookmarkForm();
    }

    async function renderEditBookmarkForm(id) {
        showWaitingGif();
        let bookmark = await API_GetBookmark(id);
        if (bookmark !== null)
            renderBookmarkForm(bookmark);
        
        else
            renderError("Bookmark introuvable!");
    }

    async function renderDeleteBookmarkForm(id) {
        showWaitingGif();
        $("#createBookmark").hide();
        $("#abort").show();
        $("#actionTitle").text("Retrait");
        let bookmark = await API_GetBookmark(id);
        eraseContent();
        if (bookmark !== null) {
            const faviconUrl = `${new URL(bookmark.Url).origin}/favicon.ico`;
            $("#content").append(`
            <div class="contactdeleteForm">
                <h4>Effacer le bookmark suivant?</h4>
                <br>
                <div class="contactRow" bookmark_id="${bookmark.Id}">
                    <div class="contactContainer">
                        <div class="contactLayout">
                            <img src="${faviconUrl}" alt="Favicon" class="bookmarkFavicon" style="width:16px; height:16px; margin-right:8px;">
                            <a href="${bookmark.Url}" target="_blank" class="bookmarkTitle">${bookmark.Title}</a>
                            <span class="bookmarkCategory">${bookmark.Category}</span>
                        </div>
                    </div>  
                </div>   
                <br>
                <input type="button" value="Effacer" id="deleteBookmark" class="btn btn-primary">
                <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
            </div>    
            `);
            $('#deleteBookmark').on("click", async function () {
                showWaitingGif();
                let result = await API_DeleteBookmark(bookmark.Id);
                if (result)
                    renderBookmarks();
                else
                    renderError("Une erreur est survenue!");
            });
            $('#cancel').on("click", function () {
                renderBookmarks();
            });
        } else {
            renderError("Bookmark introuvable!");
        }
    }

    function newBookmark() {
        bookmark = {};
        bookmark.Id = 0;
        bookmark.Title = "";
        bookmark.Url = "";
        bookmark.Category = "";
        return bookmark;
    }

    
    function renderBookmarkForm(bookmark = null) {
        $("#createBookmark").hide();
        $("#abort").show();
        eraseContent();
        let create = bookmark == null;
        if (create) bookmark = newBookmark();
        $("#actionTitle").text(create ? "Création" : "Modification");
        $("#content").append(`
            <form class="form" id="bookmarkForm">
                <input type="hidden" name="Id" value="${bookmark.Id}"/>
                <div id="faviconPreview" style="margin-top: 10px;">
                    <img id="favicon" src="bookmark.png" alt="Favicon" style="width: 32px; height: 32px;"/>
                </div>
                <label for="Title" class="form-label">Titre </label>
                <input 
                    class="form-control"
                    name="Title" 
                    id="Title" 
                    placeholder="Titre"
                    required
                    value="${bookmark.Title}"
                />
                <label for="Url" class="form-label">URL </label>
                <input
                    class="form-control URL"
                    name="Url"
                    id="Url"
                    placeholder="https://example.com"
                    required
                     RequireMessage="Veuillez entrer votre url" 
                     InvalidMessage="Veuillez entrer un url valide"
                    value="${bookmark.Url}" 
                />
                
                
    
                <label for="Category" class="form-label">Catégorie </label>
                <input 
                    class="form-control"
                    name="Category"
                    id="Category"
                    placeholder="Catégorie"
                    required
                    value="${bookmark.Category}"
                />
                <hr>
                <input type="submit" value="Enregistrer" id="saveBookmark" class="btn btn-primary">
                <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
            </form>
        `);
        initFormValidation();
        // Gestion de la soumission du formulaire
        $('#bookmarkForm').on("submit", async function (event) {
            event.preventDefault();
            let bookmark = getFormData($("#bookmarkForm"));
            bookmark.Id = parseInt(bookmark.Id);
            showWaitingGif();
            let result = await API_SaveBookmark(bookmark, create);
            if (result)
                renderBookmarks();
            else
                renderError("Une erreur est survenue!");
        });
    
        // Gestion de l'annulation
        $('#cancel').on("click", function () {
            renderBookmarks();
        });
    
        // Mise à jour du favicon lors de la saisie de l'URL
        function updateFavicon(url) {
            let faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
            let faviconElement = $("#favicon");
    
            // Vérifie si l'URL n'est pas vide
            if (url) {
                faviconElement.attr("src", faviconUrl);
                faviconElement.show();
            } else {
                faviconElement.attr("src", "bookmark.png"); // Image par défaut si URL est vide
                faviconElement.show();
            }
        }
    
        // Si une URL est déjà présente (en cas de modification), afficher le favicon
        if (bookmark.Url) {
            updateFavicon(bookmark.Url);
        }
    
        // Mise à jour du favicon lors de la modification du champ URL
        $('#Url').on("input", function () {
            let url = $(this).val();
            updateFavicon(url);
        });
    }
    
    function getFormData($form) {
        const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
        var jsonObject = {};
        $.each($form.serializeArray(), (index, control) => {
            jsonObject[control.name] = control.value.replace(removeTag, "");
        });
        return jsonObject;
    }
    function renderBookmark(bookmark) {
        const defaultFavicon = 'bookmark.png'; // URL de l'image par défaut
        let faviconUrl = '';
  
            const url = new URL(bookmark.Url);
            faviconUrl = `${url.origin}/favicon.ico`;
       
    
        return $(`
            <div class="contactRow" bookmark_id="${bookmark.Id}">
                <div class="contactContainer noselect">
                    <div class="contactLayout">
                        <img src="${faviconUrl}" alt="Favicon" class="bookmarkFavicon" style="width:16px; height:16px; margin-right:8px;" 
                             onError="this.onerror=null;this.src='${defaultFavicon}';">
                        <a href="${bookmark.Url}" target="_blank" class="bookmarkTitle">${bookmark.Title}</a>
                        <span class="bookmarkCategory">${bookmark.Category}</span>
                    </div>
                    <div class="bookmarkCommandPanel">
                        <span class="editCmd cmdIcon fa fa-pencil" editBookmarkId="${bookmark.Id}" title="Modifier ${bookmark.Title}"></span>
                        <span class="deleteCmd cmdIcon fa fa-trash" deleteBookmarkId="${bookmark.Id}" title="Effacer ${bookmark.Title}"></span>
                    </div>
                </div>
            </div>
        `);
    }