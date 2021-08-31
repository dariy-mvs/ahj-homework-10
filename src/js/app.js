import Post from './Post';

const post = new Post();
post.submitText();
post.recordingEvents(post.audioBtn, 'невозможно записать аудиосообщение', 'audio', false);
post.recordingEvents(post.videoBtn, 'невозможно записать видеосообщение', 'video', true);
post.mediaSubmitOrCancelEvents();
