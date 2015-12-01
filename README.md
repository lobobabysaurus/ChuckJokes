# chuck-jokes
A Chuck Norris Joke server implemented in Node  

## Install  
The server can be installed globally with `npm install -g chuck-jokes`

## Usage
chuck-jokes -f [string] -l [string] -o [string] -e [string] -p [num]  

Options:  
  -f, --first    First name to replace Chuck's in jokes                 [string]  
  -l, --last     Last name to replace Chuck's in jokes                  [string]  
  -o, --only     Comma separated list of categories to limit jokes      [string]  
  -e, --exclude  Comma separated list of categories to exclude jokes    [string]  
  -p, --port     Port server will run on                           [default: 17]  
  -h, --help     Show help                                             [boolean]  
  --version      Show version number                                   [boolean]  
