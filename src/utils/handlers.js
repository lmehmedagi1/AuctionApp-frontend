export const handleAlerts = (setShow, setMessage, setVariant, setData, message, variant, data) => {
    if (message != null) {
        setShow(true);
        setMessage(message);
        setVariant(variant);
    }
    else {
        setShow(false);
        setData(data);
        if (window.location.pathname == "/login")
            window.location.href = "/";
    }
}
