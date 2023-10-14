const progressBar = (() => {
    const assets = document.querySelectorAll('img');
    let totalAssets = assets.length;
    let loadedAssets = 0;

    const progress = () => {
        const progressPercentage = Math.min((loadedAssets / totalAssets) * 100, 100);

        document.getElementById('bar').style.width = progressPercentage.toString() + "%";
        document.getElementById('progress-info').innerText = `Loading asset (${loadedAssets}) [${progressPercentage.toFixed(0)}%]`;

        if (loadedAssets == totalAssets) {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            window.scrollTo(0, 0);

            tamu();
            opacity('loading');
        }
    };

    assets.forEach(asset => {
        if (asset.complete && asset.naturalWidth !== 0) {
            loadedAssets++;
            progress();
        } else {
            asset.addEventListener('load', () => {
                loadedAssets++;
                progress();
            });
        }
    });
})();

const audio = (() => {
    let instance = null;

    let createOrGet = () => {
        if (!(instance instanceof HTMLAudioElement)) {
            instance = new Audio();
            instance.autoplay = true;
            instance.src = document.getElementById('tombol-musik').getAttribute('data-url');
            instance.load();
            instance.currentTime = 0;
            instance.volume = 1;
            instance.muted = false;
            instance.loop = true;
        }

        return instance;
    }

    return {
        play: () => createOrGet().play(),
        pause: () => createOrGet().pause(),
    };
})();

// OK
const storage = (table) => ((table) => {

    const get = (key = null) => {
        if (!localStorage.getItem(table)) {
            localStorage.setItem(table, JSON.stringify({}));
        }

        if (key) {
            return JSON.parse(localStorage.getItem(table))[key];
        }

        return JSON.parse(localStorage.getItem(table));
    };

    const set = (key, value) => {
        let storage = get();
        storage[key] = value;
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const unset = (key) => {
        let storage = get();
        delete storage[key];
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const has = (key) => Object.keys(get()).includes(key);

    return {
        get: get,
        set: set,
        unset: unset,
        has: has,
    };
})(table);

// OK
const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// OK
const salin = (btn, msg = null, timeout = 1500) => {
    navigator.clipboard.writeText(btn.getAttribute('data-nomer'));

    let tmp = btn.innerHTML;
    btn.innerHTML = msg ?? 'Tersalin';
    btn.disabled = true;
    let id = null;

    id = setTimeout(() => {
        btn.innerHTML = tmp;
        btn.disabled = false;
        btn.focus();

        clearTimeout(id);
        id = null;
        return;
    }, timeout);
};

// OK
const timer = () => {
    let countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();
    let time = null;

    time = setInterval(() => {
        let distance = countDownDate - (new Date()).getTime();

        if (distance < 0) {
            clearInterval(time);
            time = null;
            return;
        }

        document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
};

// OK
const animation = () => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    let randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));

        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                y: Math.random() * skew - 0.2,
            },
            colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
            shapes: ["heart"],
            gravity: randomInRange(0.5, 1),
            scalar: randomInRange(1, 2),
            drift: randomInRange(-0.5, 0.5),
        });

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    })();
};

// OK
const buka = async () => {
    document.querySelector('body').style.overflowY = 'scroll';

    opacity('welcome');
    document.getElementById('tombol-musik').style.display = 'block';
    AOS.init();
    audio.play();

    await confetti({
        origin: { y: 0.8 },
        zIndex: 1057
    });
    animation();

    timer();
};

// OK
const play = (btn) => {
    if (btn.getAttribute('data-status') !== 'true') {
        btn.setAttribute('data-status', 'true');
        audio.play();
        btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    } else {
        btn.setAttribute('data-status', 'false');
        audio.pause();
        btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
};

// OK
const modalFoto = (img) => {
    document.getElementById('showModalFoto').src = img.src;
    (new bootstrap.Modal('#modalFoto')).show();
};

// OK
const tamu = () => {
    let name = (new URLSearchParams(window.location.search)).get('to') ?? '';

    if (name.length == 0) {
        document.getElementById('nama-tamu').remove();
        return;
    }

    let div = document.createElement('div');
    div.classList.add('m-2');
    div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(name)}</h2>`;

    // document.getElementById('form-nama').value = escapeHtml(name);
    document.getElementById('nama-tamu').appendChild(div);
};


// OK
const opacity = (nama) => {
    let op = parseInt(document.getElementById(nama).style.opacity);
    let clear = null;

    clear = setInterval(() => {
        if (op >= 0) {
            op -= 0.025;
            document.getElementById(nama).style.opacity = op;
        } else {
            clearInterval(clear);
            clear = null;
            document.getElementById(nama).remove();
            return;
        }
    }, 10);
};
