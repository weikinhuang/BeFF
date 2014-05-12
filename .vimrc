set softtabstop=2
set shiftwidth=2
set expandtab
let g:syntastic_javascript_checkers = ['jshint', 'jscs']

nmap <Leader>u :silent !rsync -rlz --exclude='.git' --exclude='node_modules' --exclude='.bundle' --filter=':- .gitignore' /Users/axal/git/be.net/ alex@devremus.be.lan:/var/www/vhosts/network/sandbox<CR>
