rm -rf tmp
start ruby bin\rails server
echo Server is not up quick enough, so please refresh
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:3000
