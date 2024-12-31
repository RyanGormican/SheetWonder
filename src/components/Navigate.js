import React from 'react';
import { Icon } from '@iconify/react';

const Navigate = ({ toggleFeedbackModal }) => {
  return (
    <span className="links">
      <a href="https://www.linkedin.com/in/ryangormican/">
        <Icon
          icon="mdi:linkedin"
          color="#0e76a8"
          style={{ width: '3.13vw', height: '5.56vh' }}
        />
      </a>
      <a href="https://github.com/RyanGormican/SheetWonder">
        <Icon
          icon="mdi:github"
          color="#e8eaea"
          style={{ width: '3.13vw', height: '5.56vh' }}
        />
      </a>
      <a href="https://ryangormicanportfoliohub.vercel.app/">
        <Icon
          icon="teenyicons:computer-outline"
          color="#199c35"
          style={{ width: '3.13vw', height: '5.56vh' }}
        />
      </a>
      <div className="cursor-pointer" onClick={toggleFeedbackModal}>
        <Icon
          icon="material-symbols:feedback"
          style={{ width: '3.13vw', height: '5.56vh' }}
        />
      </div>
    </span>
  );
};

export default Navigate;
