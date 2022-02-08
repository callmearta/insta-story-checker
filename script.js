document.addEventListener("DOMNodeInserted", checkForStoriesPage, false);

let hasFired = false;
let hasCompletedFetching = false;

function checkForStoriesPage() {
    if (!window._sharedData) {
        return;
    }
    const pathname = window.location.pathname;
    const username = window._sharedData.config.viewer.username;
    const mediaId = pathname.split('/')[3];

    if (pathname.includes('/stories/' + username) && !hasFired) {
        hasFired = true;
        removeBox();
        getAllViewers(mediaId);
    } else if (!pathname.includes('/stories/' + username)) {
        removeBox();
    } else if (pathname.includes('/stories/' + username) && hasFired && mediaId != window.currentMediaId) {
        removeBox();
        getAllViewers(mediaId);
    }
}

function removeBox() {
    const box = document.querySelector('.story-box');
    if (!box)
        return;
    box.remove();
    hasFired = false;
}

function getAllViewers(mediaId, maxId = null) {
    if (!window._storyViewers) {
        window._storyViewers = [];
    }
    if (window.currentMediaId != mediaId) {
        hasCompletedFetching = false;
        window.currentMediaId = mediaId;
    }
    const storyIndexInWindow = window._storyViewers.findIndex(media => media.mediaId == mediaId);
    if (storyIndexInWindow > -1 && hasCompletedFetching) {
        addBox();
        return;
    }
    const csrfToken = window._sharedData.config.csrf_token;
    fetch(`https://i.instagram.com/api/v1/media/${mediaId}/list_reel_media_viewer/`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,fa;q=0.8",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-asbd-id": "198387",
            "x-csrftoken": csrfToken,
            "x-ig-app-id": "1217981644879628",
        },
        "referrer": "https://www.instagram.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `include_blacklist_sample=true&${maxId ? 'max_id=' + maxId : ''}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json()).then(res => {
        if (storyIndexInWindow > -1) {
            window._storyViewers[storyIndexInWindow].users = [...window._storyViewers[storyIndexInWindow].users, ...res.users];
        } else {
            window._storyViewers.push({ users: [...res.users], mediaId: mediaId });
        }
        if (res.next_max_id) {
            setTimeout(() => getAllViewers(mediaId, res.next_max_id), 50);
        } else {
            hasCompletedFetching = true;
            addBox();
        }
    });
}

function addBox() {
    const currentStoryInfo = window._storyViewers.find(story => story.mediaId == window.currentMediaId);
    const box = document.createElement('div');
    box.classList.add('story-box');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Search');
    input.setAttribute('id', 'story-search-input');
    input.addEventListener('keyup', searchInViewers);
    input.classList.add('story-search-input');
    box.appendChild(input);
    const count = document.createElement('span');
    count.classList.add('story-viewers-count');
    count.setAttribute('id', 'story-viewers-count');
    count.innerHTML = currentStoryInfo.users.length + ' viewers';
    box.appendChild(count);
    const list = document.createElement('ul');
    list.setAttribute('id', 'story-viewers-list');
    box.appendChild(list);
    currentStoryInfo.users.slice(0, 100).forEach(user => {
        const li = createUserElement(user);
        list.appendChild(li);
    });
    document.body.appendChild(box);
};

function createUserElement(user) {
    const li = document.createElement('li');
    li.setAttribute('id', 'story-viewer-' + user.id);
    li.innerHTML = `<div class="story-user"><a href="https://instagram.com/${user.username}" target="_blank" class="story-user-avatar"><img src="${user.profile_pic_url}"/></a><div class="story-user-body"><span>${user.full_name}</span><strong class="story-viewer-username">${user.username}</strong></div></div>`;
    return li;
}

function searchInViewers() {
    const currentStoryInfo = window._storyViewers.find(story => story.mediaId == window.currentMediaId);
    const input = document.getElementById('story-search-input');
    const text = input.value.toLowerCase();
    const list = document.getElementById('story-viewers-list');
    const count = document.getElementById('story-viewers-count');
    list.innerHTML = '';
    let users;
    if (text.length > 1) {
        users = currentStoryInfo.users.filter(user => user.username.toLowerCase().includes(text) || user.full_name.toLowerCase().includes(text));
        count.innerHTML = users.length + ' viewers';
    } else {
        users = currentStoryInfo.users.slice(0, 100);
        count.innerHTML = currentStoryInfo.users.length + ' viewers';
    }
    users.forEach(user => {
        const li = createUserElement(user);
        list.appendChild(li);
    });
}