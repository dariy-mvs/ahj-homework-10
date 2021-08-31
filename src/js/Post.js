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

  static showOrHidden(selector, showIt) {
    if (showIt) {
      document.querySelector(selector).classList.remove('hidden');
    } else {
      document.querySelector(selector).classList.add('hidden');
    }
  }

  constructor() {
    this.textForm = document.querySelector('.form');
    this.textField = this.textForm.querySelector('.field');
    this.audioBtn = document.querySelector('.audio_btn');
    this.videoBtn = document.querySelector('.video_btn');
    this.container = document.querySelector('.posts');
    this.timer = undefined;
    this.stream = undefined;
    this.chunks = undefined;
    this.recorder = undefined;
    this.timerEl = undefined;
    this.mediaPost = Post.printMediaPost();
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

  mediaSubmitOrCancelEvents() {
    document.querySelector('.ok_btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.recorder.stop();
      this.stream.getTracks().forEach((track) => track.stop());
      this.timerEl.remove();
      const positionedPost = new GetPosition(this.mediaPost);
      this.container.insertAdjacentElement('beforeend', positionedPost.post);
      setTimeout(() => {
        this.timer = undefined;
        this.chunks = undefined;
        this.stream = undefined;
        this.recorder = undefined;
        this.timerEl = undefined;
        this.mediaPost = Post.printMediaPost();
        Post.showOrHidden('.audio_btn', true);
        Post.showOrHidden('.video_btn', true);
        Post.showOrHidden('.ok_btn', false);
        Post.showOrHidden('.cancel_btn', false);
      }, 700); // костыльное решение, но лучше я не придумала)) Буду рада вариантам
    });

    document.querySelector('.cancel_btn').addEventListener('click', () => {
      this.timer = undefined;
      this.chunks = undefined;
      this.stream = undefined;
      this.recorder = undefined;
      this.timerEl = undefined;
      this.mediaPost = Post.printMediaPost();
      Post.showOrHidden('.audio_btn', true);
      Post.showOrHidden('.video_btn', true);
      Post.showOrHidden('.ok_btn', false);
      Post.showOrHidden('.cancel_btn', false);
    });
  }

  recordingEvents(button, alertString, nameElement, isVideo) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      Post.showOrHidden('.audio_btn', false);
      Post.showOrHidden('.video_btn', false);
      Post.showOrHidden('.ok_btn', true);
      Post.showOrHidden('.cancel_btn', true);
      (async () => {
        if (!navigator.mediaDevices) {
          alert(alertString);
          return;
        }
        try {
          const media = document.createElement(nameElement);
          media.controls = true;
          this.mediaPost.insertAdjacentElement('beforeend', media);
          // Record:
          if (!window.MediaRecorder) {
            alert(alertString);
            return;
          }
          this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
          this.recorder = new MediaRecorder(this.stream);
          this.chunks = [];
          this.timerEl = Post.printTimer();
          this.timerEl.textContent = '00:00';
          this.recorder.addEventListener('start', () => {
            button.insertAdjacentElement('afterend', this.timerEl);
            this.timer = setInterval(() => {
              let timeArr = this.timerEl.textContent.split(':');
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
              this.timerEl.textContent = timeArr;
            }, 1000);
          });
          this.recorder.addEventListener('dataavailable', (evt) => {
            this.chunks.push(evt.data);
          });
          this.recorder.addEventListener('stop', () => {
            const blob = new Blob(this.chunks);
            media.src = URL.createObjectURL(blob);
            clearInterval(this.timer);
          });
          this.recorder.start();
        } catch (err) {
          alert(alertString);
        }
      })();
    });
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
