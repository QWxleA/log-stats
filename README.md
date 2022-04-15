<div id="top"></div>
<!--
*** Thanks for checking out the log-stats. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/QWxleA/log-stats">
    <img src="./images/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Log-Stats 📊</h3>

  <p align="center">
    Analyse your Graph for peace of mind (and quiet bragging rights)
    <br />
    <a href="https://github.com/QWxleA/log-stats"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/QWxleA/log-stats">View Demo</a>
    ·
    <a href="https://github.com/QWxleA/log-stats/issues">Report Bug</a>
    ·
    <a href="https://github.com/QWxleA/log-stats/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#Using the plugin">Using the plugin</a></li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#issues">Issues</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/QWxleA/log-stats/)


Get a quick overview of all that's in your graph:

- Number of pages
- Number of queries
- Closed number of tasks
- etc

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->

## Installation

### Preparation

- Click the 3 dots in the righthand corner and go to **Settings**.
- Go to **Advanced** and enable **Plug-in system**.
- Restart the application.
- Click 3 dots and go to Plugins (or `Esc t p`).

### Install plugin from the Marketplace (recommended) 

- Click the `Marketplace` button and then click `Plugins`.
- Find the plugin and click `Install`.

### Install plugin manually

- Download a released version assets from Github.
- Unzip it.
- Click Load unpacked plugin, and select destination directory to the unzipped folder.



<p align="right">(<a href="#top">back to top</a>)</p>

## Using the plugin

The plugin is activated with the *slash-command* `/logstats: Insert Graph Statistics`, which will insert the following placeholder:

`{{renderer :logstats}}` 

Just using it will give an overview of the data in your graph.

For debugging purposes you can add something after *logstats*, like this:

`{{renderer :logstats, anything}}`

This will give the same information, just without any styling, which makes it easier to copy/paste.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Configuration -->
## Configuration

- Click the 3 dots in the righthand corner and go to **Settings**.
- Go to **Plugin Settings**.
- Select correct plugin.

[![Configuration screen][configuration-screenshot]](##configuration)

<p align="right">(<a href="#top">back to top</a>)</p>


## Issues

**The number of pages is off by 14?** You are correct, Logseq comes with fourteen built-in pages. They do get counted in the queries. Just accept them as a free bonus.

**I type in `<something not latin>`, and my words don't get counted?** You are correct. I do not know how to count non-latin words. Help appreciated.

See the [open issues](https://github.com/QWxleA/log-stats/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Alex Qwxlea - [@QwxleaA](https://twitter.com/QwxleaA) 

Project Link: [https://github.com/QWxleA/log-stats/](https://github.com/QWxleA/log-stats/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/QWxleA/log-stats.svg?style=for-the-badge
[contributors-url]: https://github.com/QWxleA/log-stats/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/QWxleA/log-stats.svg?style=for-the-badge
[forks-url]: https://github.com/QWxleA/log-stats/network/members
[stars-shield]: https://img.shields.io/github/stars/QWxleA/log-stats.svg?style=for-the-badge
[stars-url]: https://github.com/QWxleA/log-stats/stargazers
[issues-shield]: https://img.shields.io/github/issues/QWxleA/log-stats.svg?style=for-the-badge
[issues-url]: https://github.com/QWxleA/log-stats/issues
[license-shield]: https://img.shields.io/github/license/QWxleA/log-stats.svg?style=for-the-badge
[license-url]: https://github.com/QWxleA/log-stats/blob/master/LICENSE.txt
[product-screenshot]: ./images/screenshot.gif
[configuration-screenshot]: ./images/configuration.png
