/**
 * Lightbox 2.0
 * A Remi A Olsen Production :D
 * remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 */

var lightbox = {

	// Modal container for images, and the close button for said container. Values set in "createContainer".
	lightboxContainer: ' ',
	lightboxCloseButton: ' ',
	lightboxPreviousButton: ' ',
	lightboxNextButton: ' ',
	lightboxLinkButton: ' ',

	// Generic multiple attribute setter.
	setAttributes: function (element, attributes) {
		for (var a in attributes) {
			element.setAttribute(a, attributes[a]);
		}
	},

	// Closes modal container.
	closeModal: function () {
		this.lightboxContainer.className = '';
		this.lightboxContainer.setAttribute('aria-hidden', 'true');
	},

	// If ESC key is pressed, trigger closeModal. <- and -> toggles images.
	keyboardNavigation: function (e) {
		if (e.keyCode === 27 && this.lightboxContainer.className === 'lightboxContainerActive') {
			this.closeModal();
		} else if ((e.keyCode === 37 || e.keyCode === 39) && this.lightboxContainer.className === 'lightboxContainerActive') {
			var img = this.lightboxContainer.querySelector('img'),
				newImg = e.keyCode === 37 ? img.getAttribute('data-previous-img') : img.getAttribute('data-next-img'),
				newImgElement = document.querySelector('a[data-img="' + newImg + '"]');
			this.setAttributes(img, { 'src': newImg, 'data-next-img': newImgElement.getAttribute('data-next-img'), 'data-previous-img': newImgElement.getAttribute('data-previous-img') });
		}
	},

	// Goes to either next or previous image.
	nextPreviousImage: function (e) {
		var img = this.lightboxContainer.querySelector('img'),
					newImg = e.target.getAttribute('id') === 'lightboxPreviousButton' ? img.getAttribute('data-previous-img') : img.getAttribute('data-next-img'),
					newImgElement = document.querySelector('a[data-img="' + newImg + '"]');
		this.setAttributes(img, { 'src': newImg, 'data-next-img': newImgElement.getAttribute('data-next-img'), 'data-previous-img': newImgElement.getAttribute('data-previous-img') });
	},

	// Redirects user to the image
	downloadImage: function (e) {
		var img = this.lightboxContainer.querySelector('img').getAttribute('src');
		window.location = img;
	},

	/**
	 * Churns through the element sent from "populate" to find the proper image the lightbox link is linking to.
	 * If it is not found in the initial event.target, it spins up until it finds an element with data-img set (from createLinks)
	 * and uses it to populate the lightbox container.
	 * @data: data-img attribute from initial element.
	 * @e: Initial event.
	 */
	findImage: function (data, e) {
		if (data === null) {
			var found = false,
				newTarget = e.target.parentElement;
			while (found === false) {
				if (newTarget.getAttribute('data-img') === null) {
					newTarget = newTarget.parentElement;
				} else {
					found = true;
					return newTarget.getAttribute('data-img');
				}
			}
		} else {
			return data;
		}
	},

	/**
	 * Populates the lightbox container. Image is found in data-img set in createLinks. 
	 * The image's height and width can't be more than 60px less than the window's
	 * height and width.
	 */
	populate: function (link, e) {
		e.preventDefault();
		var lightboxImageContainer = document.getElementById('lightboxImageContainer'),
			lightboxImage = this.findImage(link.getAttribute('data-img'), link),
			maxHeight = window.innerHeight - 60,
			maxWidth = window.innerWidth - 60,
			nextImage = link.getAttribute('data-next-img'),
			previousImage = link.getAttribute('data-previous-img');
		this.lightboxContainer.className = 'lightboxContainerActive';
		this.lightboxContainer.setAttribute('aria-hidden', 'false');
		lightboxImageContainer.innerHTML = '<img src="' + lightboxImage + '" alt="Full image" style="max-height: ' + maxHeight + 'px; max-width: ' + maxWidth + 'px;" data-next-img="' + nextImage + '" data-previous-img="' + previousImage + '">';
		lightboxImageContainer.addEventListener('click', this.closeModal.bind(this), true);
	},

	// Download link of image.
	createLinkButton: function () {
		this.lightboxLinkButton = document.createElement('button');
		this.lightboxLinkButton.setAttribute('id', 'lightboxLinkButton');
		this.lightboxLinkButton.innerHTML = 'Link to image';
		this.lightboxLinkButton.addEventListener('click', this.downloadImage.bind(this), false);
	},

	// Close button closes the modal container.
	createNavigationButtons: function () {
		var lightboxesCount = document.getElementsByClassName('lightbox').length;
		this.lightboxCloseButton = document.createElement('button');
		this.lightboxCloseButton.setAttribute('id', 'lightboxCloseButton');
		this.lightboxCloseButton.addEventListener('click', this.closeModal.bind(this), false);
		this.lightboxCloseButton.innerHTML = 'Close window';

		if (lightboxesCount > 1) {
			this.lightboxPreviousButton = document.createElement('button');
			this.lightboxPreviousButton.setAttribute('id', 'lightboxPreviousButton');
			this.lightboxPreviousButton.addEventListener('click', this.nextPreviousImage.bind(this), false);
			this.lightboxPreviousButton.innerHTML = 'Previous image';

			this.lightboxNextButton = document.createElement('button');
			this.lightboxNextButton.setAttribute('id', 'lightboxNextButton');
			this.lightboxNextButton.addEventListener('click', this.nextPreviousImage.bind(this), false);
			this.lightboxNextButton.innerHTML = 'Next image';
		}

		this.createLinkButton();
	},

	// Creates the modal container.
	createContainer: function () {
		this.createNavigationButtons();
		this.lightboxContainer = document.createElement('div');
		this.setAttributes(this.lightboxContainer, { 'id': 'lightboxContainer', 'aria-hidden': 'true' });
		this.lightboxContainer.innerHTML = '<figure id="lightboxImageContainer"></figure>';
		this.lightboxContainer.appendChild(this.lightboxCloseButton);
		this.lightboxContainer.appendChild(this.lightboxLinkButton);
		if (this.lightboxPreviousButton !== ' ') {
			this.lightboxContainer.appendChild(this.lightboxPreviousButton);
			this.lightboxContainer.appendChild(this.lightboxNextButton);
		}
		document.body.appendChild(this.lightboxContainer);
	},

	// Loops through links set to "lightbox" class and prepares them to open the image set in href in modal container.
	setUp: function () {
		var lightboxes = document.getElementsByClassName('lightbox');
		for (var i = 0; i < lightboxes.length; i++) {
			var lb = lightboxes[i],
				img = lb.getAttribute('href'),
				nextImage = i < (lightboxes.length - 1) ? lightboxes[i + 1].getAttribute('href') : lightboxes[0].getAttribute('data-img'),
				previousImage = i > 0 ? lightboxes[i - 1].getAttribute('data-img') : lightboxes[(lightboxes.length - 1)].getAttribute('href'),
				t = this;
			(new Image()).src = img;
			this.setAttributes(lb, { 'data-img': img, 'data-next-img': nextImage, 'data-previous-img': previousImage });
			lb.addEventListener('click', function (e) { t.populate(this, e); }, true);
		}
		document.addEventListener('keydown', this.keyboardNavigation.bind(this), false);
		this.createContainer();
	}
}

window.onload = function () {
	var l = Object.create(lightbox);
	l.setUp();
}