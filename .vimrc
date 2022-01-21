" To enable use of this project specific config, add the following to your
" ~/.vimrc:
"
"   " Enable per-directory .vimrc files
"   set exrc
"   " Disable unsafe commands in local .vimrc files
"   set secure

function! ArtsyIndent()
  setlocal expandtab
  setlocal shiftwidth=4
  setlocal softtabstop=4
  setlocal tabstop=4
  setlocal textwidth=100
  setlocal cc=100
endfunction

autocmd Filetype c,cpp,objc call ArtsyIndent()
