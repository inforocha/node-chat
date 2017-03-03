(function() {
    var obj = {
        file: null,
        send: false,
        init: function() {
            if (window.File && window.FileReader && window.FileList) { //HTML5 File API ready
                this.cacheDom();
            } else {
                alert('erro: navegador não suporta envio de arquivos');
            }
        },
        cacheDom: function() {
            this.filesUpload = document.getElementById('input-files');
        },
        bindEvents: function() {
            this.filesUpload.addEventListener('change', this.fileHandler.bind(this), false);
        },
        /**
         * Handle the file change event to send it content.
         * @param e
         */
        fileHandler: function(e) {
            var files = e.target.files || e.dataTransfer.files;

            if (files) {
                //send only the first one
                this.file = files[0];
            }
        },
        sendFile: function() {
            if (this.file) {
                //read the file content and prepare to send it
                var reader = new FileReader();

                reader.onload = function(e) {
                    console.log('Sending file...');
                    //get all content
                    var buffer = e.target.result;
                    // chamando o modulo de sockets para disparar o evento e enviar o conteudo
        			eventos.emit('upload',{name: file.name, buffer: buffer});
                };
                reader.readAsBinaryString(file);
            }
        }
    }

    obj.init();
})();



