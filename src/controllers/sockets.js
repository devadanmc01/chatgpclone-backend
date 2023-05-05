const {io} = require ('../../index')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-EGH0s1FOJiAtzwVKqvy2RSTw",
    apiKey:'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',
});
const openai = new OpenAIApi(configuration);


io.on("connection", (socket) => {
    console.log("A user connected.");
  
    socket.on("message", async (message) => {
      console.log("Message received:", message);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `${message}`}],
      });
      console.log(completion.data.choices[0].message.content);
      io.emit("message", {
        username:completion.data.choices[0].message.role,
        text: completion.data.choices[0].message.content,
        time: Date.now(),
      });
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });

