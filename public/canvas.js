const distance = (x1, y1, x2, y2) => {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    
    return (Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

const draw = () => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const camX = -player.x + canvas.width / 2;
    const camY = -player.y + canvas.height / 2;
    context.translate(camX, camY);
    
    players.forEach((p) => {
        if (!p.playerData) return;
        
        context.beginPath();
        context.fillStyle = p.playerData.color;
        context.arc(p.playerData.x, p.playerData.y, p.playerData.radius, 0, 2 * Math.PI);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(255, 255, 255)';
        context.stroke();
        
        context.fillStyle = 'rgb(255, 255, 255)';
        context.font = 'bold 12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(p.playerData.name, p.playerData.x, p.playerData.y - p.playerData.radius - 10);
    });
    
    orbs.forEach((orb) => {
        if (distance(player.x, player.y, orb.x, orb.y) < Math.pow(Math.max(canvas.width + 10, canvas.height + 10), 2)) {
            context.beginPath();
            context.fillStyle = orb.color;
            context.arc(orb.x, orb.y, orb.radius, 0, 2 * Math.PI);
            context.fill();
        }
    });
    
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (event) => {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / Math.PI;
    if (angleDeg >= 0 && angleDeg < 90) {
        xVector = 1 - (angleDeg / 90);
        yVector = -(angleDeg / 90);
    } else if (angleDeg >= 90 && angleDeg <= 180) {
        xVector = -(angleDeg - 90) / 90;
        yVector = -(1 - ((angleDeg - 90) / 90));
    } else if (angleDeg >= -180 && angleDeg < -90) {
        xVector = (angleDeg + 90) / 90;
        yVector = (1 + ((angleDeg + 90) / 90));
    } else if (angleDeg < 0 && angleDeg >= -90) {
        xVector = (angleDeg + 90) / 90;
        yVector = (1 - ((angleDeg + 90) / 90));
    }
    
    player.xVector = xVector ? xVector : .1;
    player.yVector = yVector ? yVector : .1;
})
