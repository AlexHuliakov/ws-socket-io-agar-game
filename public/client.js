let socket;

const init = async () => {
    const SERVER_URL = await fetch(`${window.location.origin}/api/server-url`).then((res) => res.json()).then((data) => data.SERVER_URL);
    
    socket = io.connect(SERVER_URL);
    const initdData = await socket.emitWithAck('init', {
        playerName: player.name
    });
    
    orbs = initdData.orbs;
    player.index = initdData.index;

    setInterval(() => {
        socket.emit('client-tick', {
            xVector: player.xVector ? player.xVector : .1,
            yVector: player.yVector ? player.yVector : .1,
        });
    }, 1000 / 30);

    player.x = Math.floor(Math.random() * WW);
    player.y = Math.floor(Math.random() * WH);
    draw();
    
    document.querySelector('.leader-board').innerHTML = `
        <li class="leaderboard-player">${player.name} - <span class="player-score">0</span></li>`;
        
    
    socket.on('tick', (newPlayers) => {
        players = newPlayers;
        
        if (players[player.index].playerData) {
            player.x = players[player.index].playerData.x;
            player.y = players[player.index].playerData.y;
        }
    });

    // On disconnect, refresh the page
    socket.on('disconnect', () => {
        window.location.href = window.location.href + '/';
    });

    socket.on('orb-update', (data) => {
        orbs.splice(data.capturedOrb, 1, data.newOrb);
    });

    socket.on('player-absorb', (data) => {
        document.querySelector('#game-message').innerHTML = `${data.absorbedBy} absorbed ${data.absorbed}!`;
        document.querySelector('#game-message').style.opacity = 1;
        
        setTimeout(() => {
            document.querySelector('#game-message').style.opacity = 0;
        }, 2000);
    });

    socket.on('update-leaderboard', (data) => {
        document.querySelector('.leader-board').innerHTML = '';
        data.forEach((newPlayer) => {
            if (!newPlayer.name) return;
            if (player.name == newPlayer.name) {
                document.querySelector('.player-score').textContent = newPlayer.score;
            }
            
            document.querySelector('.leader-board').innerHTML += `
                <li class="leaderboard-player">${newPlayer.name} - ${newPlayer.score}</li>`

        });
    });
}

