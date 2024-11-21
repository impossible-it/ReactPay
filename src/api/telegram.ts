const baseUrl = "https://api.telegram.org/bot7037906282:AAGcuaIMTrtKZuQ0t2JwRV6c5YUgGfjTmDw/";

export const sendMessage = async (message: string): Promise<void> => {
    const url = `${baseUrl}sendMessage?chat_id=4584102892&text=${encodeURIComponent(message)}`;

    const response = await fetch(url);

    console.log("response", response);
};

export const sendMessageGroup = async (message: string): Promise<void> => {
    const url = `${baseUrl}sendMessage?chat_id=-4584299290&text=${encodeURIComponent(message)}`;

    const response = await fetch(url);

    console.log("response", response);
};
