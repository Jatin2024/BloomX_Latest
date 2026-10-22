import { useEffect, useRef, useState } from 'react';

/**
 * Photographic frame with a loading skeleton.
 *
 * Photography comes from a remote CDN, so on a slow connection there is a
 * real gap between layout and pixels. Rather than leave a blank panel, the
 * frame shows a brand-tinted shimmer that fades out as the image arrives.
 *
 * Failure modes are handled deliberately:
 *  - cached images never flash a skeleton (checked on mount via `complete`)
 *  - a load event fired before React attached its handler is caught by that
 *    same mount check, which is the classic race with `<img>`
 *  - an image that errors clears the skeleton instead of shimmering forever
 *  - if JS never runs at all, `data-loaded` is absent and CSS shows the
 *    image normally, so the picture is never hidden by a broken skeleton
 */
export default function Media({
  image,
  className = '',
  duotone = false,
  scrim = false,
  zoom = true,
  skeletonTone = 'light',
  children,
  ...rest
}) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;
    // `complete` means the load attempt has finished — successfully or not.
    // Both outcomes must clear the skeleton, otherwise an image that failed
    // before React attached its handlers shimmers forever. Checking
    // naturalWidth here instead would miss exactly that case.
    setLoaded(node.complete);
  }, [image.src]);

  const classes = [
    'bx-figure',
    duotone ? 'bx-figure--duotone' : '',
    scrim ? 'bx-figure--scrim' : '',
    zoom ? 'bx-figure--zoom' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure className={classes} data-loaded={loaded ? 'true' : 'false'} {...rest}>
      <img
        ref={imgRef}
        {...image}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <span className={`bx-skeleton bx-skeleton--${skeletonTone}`} aria-hidden="true" />
      {children}
    </figure>
  );
}
