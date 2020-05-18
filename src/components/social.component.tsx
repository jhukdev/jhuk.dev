import React from 'react';
import style from './social.module.scss';

/* -----------------------------------
 *
 * Assets
 *
 * -------------------------------- */

import twitterIcon from '../images/twitter-icon.svg';
import linkedinIcon from '../images/linkedin-icon.svg';
import githubIcon from '../images/github-icon.svg';

/* -----------------------------------
 *
 * Constants
 *
 * -------------------------------- */

const socialIcons = [
  {
    title: 'Twitter',
    src: twitterIcon,
    url: 'https://twitter.com/jhukdev',
  },
  {
    title: 'LinkedIn',
    src: linkedinIcon,
    url: 'https://www.linkedin.com/in/james-hill-6bb080112',
  },
  {
    title: 'Github',
    src: githubIcon,
    url: 'https://github.com/jhukdev',
  },
];

/* -----------------------------------
 *
 * Social
 *
 * -------------------------------- */

function Social() {
  return (
    <div className={style.social}>
      <div className={style.inner}>
        <h3 className={style.title}>Follow Me</h3>
        <ul className={style.list}>
          {socialIcons.map((icon) => (
            <li key={icon.url} className={style.item}>
              <a
                href={icon.url}
                className={style.link}
                target="_blank"
                rel="noopener"
              >
                <img className={style.icon} src={icon.src} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export default Social;
