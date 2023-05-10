// https://animate.style/
export const animate = (element, animation, extraClasses = []) =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `animate__${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`animate__animated`, animationName);
    if (extraClasses.length > 0) {
      extraClasses.forEach(extraClass => node.classList.add(`animate__${extraClass}`));
    }

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`animate__animated`, animationName);
      if (extraClasses.length > 0) {
        extraClasses.forEach(extraClass => node.classList.remove(`animate__${extraClass}`));
      }
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
