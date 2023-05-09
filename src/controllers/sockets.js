const { io } = require("../../index");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);
const redisAdapter = require('socket.io-redis');
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
io.adapter(redisAdapter(redisUrl));

io.on("connection", (socket) => {
  try {
    console.log("A user connected.");
    socket.on("message", async (message) => {
      console.log("Message received:", message);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${message}` }],
      });
      console.log(completion.data.choices[0].message.content);
      const resp = completion.data.choices[0].message.content;
      if (resp) {
        io.emit("message", {
          username: completion.data.choices[0].message.role,
          text: completion.data.choices[0].message.content,
          time: Date.now(),
        });
      } else {
        throw new Error("OpenAI response was empty");
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    io.emit("error", "Error with OpenAI API");
  }
});
