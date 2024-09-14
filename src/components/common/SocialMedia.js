import React from 'react';

import {
    WhatsappShareButton,
    FacebookShareButton,
    FacebookMessengerShareButton,
    TelegramShareButton,
    TwitterShareButton,
    EmailShareButton,
} from "react-share";

import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

const size = 40;
const SocialMedia = ({ shareUrl }) => {
    return (
        <div>
            <FacebookShareButton url={shareUrl} aria-label="Share on Facebook">
                <FacebookIcon size={size} round={true} />
            </FacebookShareButton>
            <FacebookMessengerShareButton url={shareUrl} aria-label="Share on Facebook Messenger">
                <FacebookMessengerIcon size={size} round={true} />
            </FacebookMessengerShareButton>
            <WhatsappShareButton url={shareUrl} aria-label="Share on Whatsapp">
                <WhatsappIcon size={size} round={true} />
            </WhatsappShareButton>

            <TelegramShareButton url={shareUrl} aria-label="Share on Telegram">
                <TelegramIcon size={size} round={true} />
            </TelegramShareButton>

            <TwitterShareButton url={shareUrl} aria-label="Share on Twitter">
                <TwitterIcon size={size} round={true} />
            </TwitterShareButton>

            <EmailShareButton url={shareUrl} aria-label="Share via Email">
                <EmailIcon size={size} round={true} />
            </EmailShareButton>
        </div>
    );
}

export default SocialMedia;