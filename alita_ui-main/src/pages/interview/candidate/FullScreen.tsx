export const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
};

export const exitFullscreen = () => {
    removeOverlay();
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
};

export const removeOverlay = () => {
    setTimeout(() => {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.remove();
        }
    }, 100);
};

export const createOverlay = () => {
    if (!document.querySelector('.fullscreen-overlay')) {
        const overlay = document.createElement('div');
        overlay.className =
            'fullscreen-overlay fixed top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center z-[10000]';

        overlay.innerHTML = `
        <div class="text-center p-6 bg-white bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg">
            <p class="text-sm md:text-base mb-5 text-black">Exiting fullscreen is not allowed during the interview.</p>
            <button id="reenterFullscreen" class="px-5 py-2 cursor-pointer text-white rounded-sm text-sm md:text-base
            bg-[#0f458c] font-semibold">
                Re-enter Fullscreen
            </button>
        </div>
    `;

        document.body.appendChild(overlay);

        const reenterButton = document.getElementById('reenterFullscreen');
        reenterButton?.addEventListener('click', () => {
            enterFullscreen();
            removeOverlay();
        });
    }
};

const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
        createOverlay();
    } else {
        removeOverlay();
    }
};

const handlePathChange = () => {

    if (window.location.pathname !== "/interview") {
        removeOverlay();
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        exitFullscreen();
    }
};

const initializeFullscreenHandler = (allowedPath: string) => {
    if (window.location.pathname === allowedPath) {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        enterFullscreen();
    } else {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        exitFullscreen();
        removeOverlay();
    }
};

const Fullscreen = (allowedPath: string, navigateTo: (path: string) => void) => {
    handlePathChange();

    if (window.location.pathname !== allowedPath) {
        navigateTo(allowedPath);
        removeOverlay();

        setTimeout(() => {
            if (window.location.pathname === allowedPath) {
                initializeFullscreenHandler(allowedPath);
            }
        }, 100);
    } else {
        initializeFullscreenHandler(allowedPath);
    }
};

window.addEventListener('popstate', handlePathChange);

export { Fullscreen };