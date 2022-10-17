export const getUrl = () => {

    if (process.env.HOST_URL) {
        return process.env.HOST_URL
    }

    return `http://localhost:${process.env.PORT ?? 3000}`;

}