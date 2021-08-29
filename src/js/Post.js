import GetPosition from './Geolocation';

export default class Post {
  static printTimer() {
    const timer = document.createElement('p');
    timer.className = 'timer';
    return timer;
  }

  static printMediaPost() {
    const postElem = document.createElement('div');
    postElem.className = 'post';
    return postElem;
  }

  constructor() {
    this.textForm = document.querySelector('.form');
    this.textField = this.textForm.querySelector('.field');
    this.audioBtn = document.querySelector('.audio_btn');
    this.videoBtn = document.querySelector('.video_btn');
    this.container = document.querySelector('.posts');
  }

  submitText() {
    const submitBtn = this.textForm.querySelector('.submit_btn');
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const post = this.printTextPost();
      const positionedPost = new GetPosition(post);
      this.container.insertAdjacentElement('beforeend', positionedPost.post);
      this.textField.value = '';
    });
  }

  recordingEvents(button, alertString, nameElement, isVideo) {
    let timer;
    let stream;
    let chunks;
    let recorder;
    let timerEl;
    let mediaPost = Post.printMediaPost();
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      (async () => {
        if (!navigator.mediaDevices) {
          alert(alertString);
          return;
        }
        try {
          const media = document.createElement(nameElement);
          media.controls = true;
          mediaPost.insertAdjacentElement('beforeend', media);
          // Record:
          if (!window.MediaRecorder) {
            alert(alertString);
            return;
          }
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
          recorder = new MediaRecorder(stream);
          chunks = [];
          timerEl = Post.printTimer();
          timerEl.textContent = '00:00';
          recorder.addEventListener('start', () => {
            button.insertAdjacentElement('afterend', timerEl);
            timer = setInterval(() => {
              let timeArr = timerEl.textContent.split(':');

              if (+timeArr[1] >= 60) {
                timeArr[0] = +timeArr[0] + 1;
                timeArr[1] = +timeArr[1];
              } else {
                timeArr[0] = +timeArr[0];
                timeArr[1] = +timeArr[1] + 1;
              }
              timeArr = timeArr.map((el) => {
                if (el < 10) {
                  return `0${el}`;
                }
                return `${el}`;
              }).join(':');
              timerEl.textContent = timeArr;
            }, 1000);
          });
          recorder.addEventListener('dataavailable', (evt) => {
            chunks.push(evt.data);
          });
          recorder.addEventListener('stop', () => {
            console.log('recording stopped');
            const blob = new Blob(chunks);
            media.src = URL.createObjectURL(blob);
            clearInterval(timer);
          });
          recorder.start();
        } catch (err) {
          alert(alertString);
        }
      })();
    });
    button.addEventListener('mouseup', (e) => {
      e.preventDefault();
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      timerEl.remove();
      const positionedPost = new GetPosition(mediaPost);
      this.container.insertAdjacentElement('beforeend', positionedPost.post);
      setTimeout(() => {
        timer = undefined;
        chunks = undefined;
        stream = undefined;
        recorder = undefined;
        timerEl = undefined;
        mediaPost = Post.printMediaPost();
      }, 700); // костыльное решение, но лучше я не придумала)) Буду рада вариантам
    });

    button.addEventListener('click', (e) => { e.preventDefault(); });
  }

  printTextPost() {
    const post = document.createElement('div');
    const posts = [...document.querySelectorAll('.post')];
    post.className = 'post textmessage';
    post.dataset.postId = posts.length + 1;
    post.innerHTML = `<p class="post__text">${this.textField.value}</p>`;
    return post;
  }
}
