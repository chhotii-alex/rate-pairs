
# Things to be aware of for using this

I did not set up a database. Raters' responses are stored in the browser's local storage wherever this task is run.
This means that as things stand, you cannot send someone the URL of this task for them to run it on their own machine--
the data will be on their machine, you can't get it.

Run this on a machine that you control, and download the data file right after someone goes through the quiz. The
data is in json format and should be pretty obvious (open  an issue if anything about the data isn't obvious).

# How to update the images used

To add more image pairs, check the image files (one image per file, *not* two) into this repo in the static/images/ directory.

Edit `src/routes/data.js` to replace the pairs of file names with pairs of files that you actually want to use.


# How to get this running

* Install `npm` on your computer.
* `git clone` this repo.
* `cd` into this repo's root directory on your computer
* enter the `npm install` command
* `npm run build`
* `npm run preview`
* When you run `npm run preview` it will show you in the terminal window a URL for the task page. Enter that URL in a browser on a device on the local network. Then this should just run in that page...

If any of this doesn't work as advertised, please open an Issue and vent me all the details, thanks!

