To begin with, I decided to use node.js and electron to create this application. I decided to use electron so I could make a desktop app that runs on the machine instead of the browser. I decided to use node.js because I wanted to use some frameworks like Web Audio API that would allow me to do things with audio, like create a metronome and do recording. 

Starting at the main process (main.js), this is where the project begins. Main sets up the window and is able to switch them. Note the use of ipcMain, which I will explain now:

- Node communicates between the *main* process (access to node) and the *renderer* process (an instance of the browser) using a node script called preload.js. In this script, specific commands are exposed to the renderer processes from the main process; only what needs to be used (for security purposes). 

- For example, in order to open a new page, I sent a command from the renderer process using ipcRenderer.send, and then defined what it should do in the preload process, and then handled it in the main process with ipcMain.on().

- Note the localStorage definitions in preload.js. This sets up the local storage of the tempo and beat.

Now, the first renderer process loaded is index.js, which is the home of the project. From this point, it's like a regular html/css/javascript project.

I will talk about the implementation of different functions now.

A lot of the project is heavily dependent on Web Audio API, which is necessary for all the audio-related components to work. The first task was to get a metronome. I tried many different techniques for this: first with setInterval, but I found out that this was not completely accurate and wanted a more accurate method. I tried for a long time to get some libraries to work here but I was unable to do so. I found a wonderful metronome design by [Grant James](https://github.com/grantjames/metronome), and used a lot of this code to create a functional metronome. Within this, I learned how to use promises to create the metronome count-in for recording. 

Now, the recording function. This code is contained in recorder.js. There are comments in that file to guide you through the process.

Index.js contains the code for compiling the audio, which uses the *crunker* library of JS. Again, follow the comments for a more in-depth guide. 

index-functionality.js just makes the elements on theh html page dynamic.

*Note:* I left in some of my previous attempts to make an audio compiler, commented out. It took **a lot** of time.

Finally, metronome.html and metronomedisplay.js are quite simple metronome tempo and beat storage functions.

And that's about it!