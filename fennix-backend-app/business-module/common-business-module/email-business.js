const nodeMailer = require('nodemailer');
const {roleHTMLCreator, roleMailBody} = require('../../util-module/util-constants/fennix-email-html-conatants');

const forgotPasswordemailBusiness = async (emailId, fullName, roleId) => {
    const subject = `Hi ${fullName}.Reset your password to Sofia`;
    let body = roleHTMLCreator('Forgot Password?', 'No worries.Please click on the button below to reset the password', 'Reset Password', `http://patdoj.fennix.global:4200/newLogin?emailId=${emailId}&roleId=${roleId}&fullName=${fullName}`);
    nodeMailerTransport(subject, emailId, body);
};

const emailSendBusiness = async (emailId, roleId, fullName) => {
    const subject = `Hi ${fullName}. Welcome to Sofia`;
    let body;
    body = mailModifier(emailId, roleId, fullName);
    nodeMailerTransport(subject, emailId, body);
};

const notificationEmailBusiness = async (emailId, notificationType, containerDetails) => {
    let subject = notificationModifier(notificationType);
    let body;
    // console.log('container Details');
    console.log(containerDetails);
    body = roleMailBody[notificationType];
    nodeMailerTransport(subject, emailId, body);
};

const notificationModifier = (notificationType) => {
    const notificationBodyMap = {
        start_trip: 'Sofia - Your Container Trip Has Started',
        end_trip: 'Sofia - Your Container Trip Has Ended',
        unlock_device: 'Sofia - The Container being transported has been unlocked',
        geo_fence: 'Sofia - Your Container Trip Has some geofence violation',
    };
    return notificationBodyMap[notificationType];
};

const nodeMailerTransport = (subject, emailId, body) => {
    const transporter = nodeMailer.createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        service: 'gmail',
        auth: {
            user: 'fennixtest@gmail.com',
            pass: 'Fennix@gmail'
        },
    });

    const mailOptions = {
        from: 'fennixtest@gmail.com',
        to: emailId,
        subject: subject,
        html: body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log(info);
        }
    });
};
const mailModifier = (email, roleId, fullName) => {
    let body, url, urlName, header, returnMailBody;
    url = `${roleMailBody[roleId].url}?emailId=${email}&roleId=${roleId}&fullName=${fullName}`;
    body = roleMailBody[roleId].body;
    urlName = roleMailBody[roleId].urlName;
    header = roleMailBody[roleId].header;
    returnMailBody = roleHTMLCreator(header, body, urlName, url);
    return returnMailBody;
};