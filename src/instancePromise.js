new Promise((resolve, reject) => {
    setTimeout(() => {
        if (Math.random() > 0.5) {
            console.log('i made a cup of coffee,excellent!');
            resolve('coffee');
        } else {
            console.log('i made a cup of cokePowder,sadness!');
            reject('cokePowder');
        }
    }, 500);
});