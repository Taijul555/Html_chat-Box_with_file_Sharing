$(() => {
    var socket = io('http://localhost:8004');
    socket.on('connect', () => {
        var loader = new SocketIOFileUpload(socket);
        loader.listenOnInput(document.getElementById("fu"))
        loader.listenOnDrop(document.getElementById("drop"));
        $('#pconnect').show();
        $('#connect').click(() => {
           // alert($('#dname').val())
            socket.emit('register', $('#dname').val());
        });
        $('#send').click(() => {
            if($("#gname").html()=="")
            {
                
                SnackBar({
                    message: `You can send meassge or file only in an active room`,
                    position: "tc",
                    status: "info",
                  });
            }
            else
            {
                socket.emit('chat', $('#msg').val());
                $('#msg').val('');
            }
            
        });
        $('#join').click(() => {
            socket.emit('joinrequest', $('#groups').val());
            
        });
        $('#create').click(() => {
            socket.emit('create', $('#group').val());
            $('#group').val('');
        });
        $('#browse').click(() => {
            $('#fu').trigger('click');
        });
        socket.on('regsuccess', name => {
            //console.log(name);
            $("#hname").html(name);
            $('#pconnect').hide();
            $('#pchat').show();
        });
        socket.on('joinsuccess', name => {
            //console.log(name);
            $("#gname").html("/"+name);
            
        });
        socket.on('userlist', names => {
            //console.log(names);
            $('#users').empty(),
                names.forEach(n => {
                    $('#users').append(`<li>${n}</li>`);
                });
        });
        socket.on('grouplist', names => {
            //console.log(names);
            $('#groups').empty(),
                names.forEach(n => {
                    $('#groups').append(`<option>${n}</option>`);
                });
        });
        socket.on('message', m => {

            $('#messages').append(`<li>${m.from}: ${m.msg}</li>`);

        });
        socket.on('uploaded', m => {

            console.log(m);
            $('#files').append(`<figure>
                <img src="uploads/${m.type=='image' ? m.file: 'file.png'}" />
                <figcaption>Uploaded by ${m.from}</figcaption>
                <a target='_blank' href="uploads/${m.file}">Download</a>
            </figure>`);
        });
        loader.addEventListener("complete", function (event) {
            console.log(event.success);
            SnackBar({
                message: `${event.file.name} uploaded`,
                position: "bc"
            });
        });
    });
    
});