import onChange from 'on-change';

export default (elements, state, i18n) => {
  const { input, feedback, submit } = elements;

  const handleStatus = (status) => {
    switch (status) {
      case 'sending':
        submit.disabled = true;
        input.readOnly = true;
        feedback.textContent = '';
        input.classList.remove('is-invalid');
        break;
      default:
        submit.disabled = false;
        input.readOnly = false;
        break;
    }
  };

  const handleFeedbacks = (content) => {
    if (state.form.feedback !== 'success') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    } else {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.value = '';
    }
    feedback.textContent = i18n(`feedback.${content}`);
  };

  const createList = (title) => {
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardTitle = document.createElement('h2');
    const list = document.createElement('ul');

    card.classList.add('card', 'border-0');
    cardBody.classList.add('card-body');
    cardTitle.classList.add('card-title', 'h4');
    list.classList.add('list-group', 'border-0', 'rounded-0');
    cardTitle.textContent = i18n(title);

    cardBody.append(cardTitle);
    card.append(cardBody);
    card.append(list);
    return card;
  };

  const createFeed = (feed) => {
    const { title, description } = feed;
    const listItem = document.createElement('li');
    const listItemTitle = document.createElement('h3');
    const listItemParagraph = document.createElement('p');

    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    listItemTitle.classList.add('h6', 'm-0');
    listItemParagraph.classList.add('m-0', 'small', 'text-black-50');
    listItemTitle.textContent = title;
    listItemParagraph.textContent = description;

    listItem.append(listItemTitle);
    listItem.append(listItemParagraph);

    return listItem;
  };

  const createPost = (post) => {
    const { title, link, id } = post;
    const listItem = document.createElement('li');
    const linkItem = document.createElement('a');
    const button = document.createElement('button');

    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    if (state.visitedPostsId.has(id)) {
      linkItem.classList.add('fw-normal', 'link-secondary');
    } else {
      linkItem.classList.add('fw-bold');
    }
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    linkItem.setAttribute('href', link);
    linkItem.setAttribute('target', '_blank');
    linkItem.setAttribute('data-id', id);
    linkItem.setAttribute('rel', 'noopener');
    linkItem.setAttribute('noreferrer', 'noreferrer');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    linkItem.textContent = title;
    button.textContent = i18n('view');

    listItem.append(linkItem);
    listItem.append(button);

    return listItem;
  };

  const renderContent = (item, content) => {
    const contentElement = document.querySelector(`.${content}`);
    contentElement.innerHTML = '';
    contentElement.append(createList(content));
    const list = contentElement.querySelector('ul');
    if (content === 'feeds') {
      item.forEach((feed) => list.append(createFeed(feed)));
    } else {
      item.forEach((post) => list.append(createPost(post)));
    }
  };

  const renderDisplayedPost = (postId) => {
    const { modalTitle, modalDescription, modalLink } = elements;
    const currentPost = state.posts.find((post) => post.id === postId);
    modalTitle.textContent = currentPost.title;
    modalDescription.textContent = currentPost.description;
    modalLink.setAttribute('href', currentPost.link);
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.status':
        handleStatus(value);
        break;
      case 'form.feedback':
        handleFeedbacks(value);
        break;
      case 'feeds':
        renderContent(value, 'feeds');
        break;
      case 'posts':
      case 'visitedPostsId':
        renderContent(state.posts, 'posts');
        break;
      case 'modal.postId':
        renderDisplayedPost(value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
