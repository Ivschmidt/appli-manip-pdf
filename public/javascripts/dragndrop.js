/**
 * Created by nahel on 16/01/2017.
 */

var NBFILE = 0;

var dropZone = document.getElementById('drop-zone');


//Fonction permettant d'ajouter plusieurs listener d'un coup
function addListenerMulti(el, s, fn) {
    var evts = s.split(' ');
    for (var i=0, iLen=evts.length; i<iLen; i++) {
        el.addEventListener(evts[i], fn, false);
    }
}
//Permet d'empecher le navigateur d'ouvrir les fichiers à sa facons
addListenerMulti(window,'drag dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
});


dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropZone.className = "upload-drop-zone dragover";

});

dropZone.addEventListener('dragleave', function(e) {
    dropZone.className="upload-drop-zone";
});



dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt    = e.dataTransfer;
    if(dt.files.length!=0) {
        var name = dt.files[0].name;
    }
    if(name==null || name.substring(name.length-4,name.length) != ".pdf"){
        alert("Vous ne pouvez ajouter que des fichiers PDF.");
        dropZone.className="upload-drop-zone";
        return;
    }
    dropZone.className="upload-drop-zone";
    $('#zoneDropText').replaceWith('<b id="zoneDropText">Fichier ajouté !</b>');
    window.setTimeout(function(){
        $('#zoneDropText').replaceWith('<b id="zoneDropText">Glisser-Déposer un PDF.</b>');
    }, 5000);

    // Récupération des données :

    var files = dt.files;
    for (var i=0; i<files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        var name = file.name;
        //attach event handlers here :
        reader.addEventListener('loadend', function(e, file) {
            var bin           = this.result;
            var pdf=document.createElement('object');
            pdf.type="application/pdf";
            pdf.data=bin;
            pdf.width="100%";
            pdf.height="600";
            pdf.id="pdf";
            var oldpdf=document.getElementById('pdf');
            if(oldpdf!=null) {
                document.getElementById('zone-pdf').removeChild(oldpdf);
            }
            document.getElementById('zone-pdf').appendChild(pdf);
            addNewFile();
            addListenerZoneMobile(NBFILE);
            document.getElementById('inputPath'+NBFILE).value=name;

        });
        reader.readAsDataURL(file);
    }

    return false;
});


function addListenerZoneMobile(id){
    document.getElementById('tiretMove'+id).addEventListener('dragstart', function (e) {
        var dt=e.dataTransfer;
        dt.setDragImage(document.getElementById('zoneMobile'+id),70,50);
        dt.data=document.getElementById('inputPath'+id).value;
    });

    document.getElementById('tiretMove'+id).addEventListener('dragend', function (e) {
        var zone_nbfile=document.getElementById('zone_nbFile');
        var name=e.dataTransfer.data;
        zone_nbfile.removeChild(document.getElementById('zoneMobile'+id));
        addNewFile();
        addListenerZoneMobile(NBFILE);
        document.getElementById('inputPath'+NBFILE).value=name;
    });

}

addListenerZoneMobile(0);