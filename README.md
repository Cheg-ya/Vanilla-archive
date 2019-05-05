# Vanilla Archive
[archive.org](https://archive.org/)와 같이 요청 받은 Website를 스크랩하여 저장하고 불러올 수 있는 어플리케이션입니다.


<p align="center">
  <img src="vanilla-archive.gif">
</p>

## Setup

```sh
 npm install
```
  
## Development

```sh
 npm run dev
 visit localhost:3000
```

## Features
- 기본적으로 웹사이트를 archive시킬 수 있는 웹 서비스입니다.
- 메인 화면에는 사용자가 Website URL(예. `www.google.com`)을 입력할 수 있는 입력칸이 있습니다.
- 사용자가 입력한 인터넷 주소에 해당하는 웹사이트 정보(HTML/CSS)를 archive 시킵니다.
- 아직까지 한번도 archive 요청을 받지 않은 웹사이트라면, archive를 원하는지에 대한 모달을 띄워 사용자로부터 확인받습니다.
- 이전에 archive 기록이 존재하는 웹사이트라면 달력을 보여주고 사용자가 확인하고 싶은 시점의 archive 사본을 선택할 수 있습니다.
- 달력에서 날짜를 선택하면, 해당 날짜에 archive된 웹사이트 사본을 볼 수 있습니다.
- 한번 archive 요청을 받은 웹사이트는 주기적으로 자동 archive 시킵니다.
