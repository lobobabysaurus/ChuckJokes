# chuck-jokes
A Chuck Norris Joke server implemented in Node  
It supports both IPv4 and IPv6 as well as both TCP and UDP in line with [IETF RFC-865][rfc-link]

## Install
The server can be installed globally with `npm install -g chuck-jokes`  
If a port is not specified when running the server, it will run on port 17 and must be  
run with root/admin rights.

## Usage
chuck-jokes -f [string] -l [string] -o [string] -e [string] -p [number]  

Options:  
  -f, --first    First name to replace Chuck's in jokes                 [string]  
  -l, --last     Last name to replace Chuck's in jokes                  [string]  
  -o, --only     Comma separated list of categories to limit jokes      [string]  
  -e, --exclude  Comma separated list of categories to exclude jokes    [string]  
  -p, --port     Port server will run on                           [default: 17]  
  -h, --help     Show help                                             [boolean]  
  --version      Show version number                                   [boolean]

[rfc-link]: https://tools.ietf.org/html/rfc865
