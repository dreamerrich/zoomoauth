import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Button from '../elements/Button';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Plans = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Plans & Pricing',
    paragraph: 'Vitae aliquet nec ullamcorper sit amet risus nullam eget felis semper quis lectus nulla at volutpat diam ut venenatis tellus—in ornare.'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
    <Header />
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-right" data-reveal-delay="200">
              <div className="tiles-card">
                <h2>Basic</h2>
                <div className="content">
                    <h4>Free</h4>
                    <Button wideMobile>Sign up</Button>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0">
                    <p>Meetings</p>
                    <p>100 Attendees</p>
                    <p>WhiteBoard</p>
                    <p>Team Chat</p>
                    <p>Mail & Calender</p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-card">
                <h2>Pro</h2>
                <div className="content">
                    <h4>13,200 Rs/year/user</h4>
                    <Button color="primary" wideMobile>Buy Now</Button>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0">
                    <p>Meetings</p>
                    <p>100 Attendees</p>
                    <p>WhiteBoard</p>
                    <p>Team Chat</p>
                    <p>Mail & Calender</p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-left" data-reveal-delay="200">
              <div className="tiles-card">
                <h2>Bussiness</h2>
                <div className="content">
                    <h4>18,000 Rs/year/user</h4>
                    <Button color="primary" wideMobile>Buy Now</Button>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0">
                    <p>Meetings</p>
                    <p>100 Attendees</p>
                    <p>WhiteBoard</p>
                    <p>Team Chat</p>
                    <p>Mail & Calender</p>
                </div>
              </div>
            </div>

            </div>
          </div>
          </div>
      <Footer/>
    </section>
  );
}
Plans.propTypes = propTypes;
Plans.defaultProps = defaultProps;

export default Plans;