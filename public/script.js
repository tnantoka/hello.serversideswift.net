$(function(){
  var $toc = $('<p></p>')
  $(':header').each(function() {
    if (this.tagName == 'H1') return
    var $this = $(this)
    $this.prop('id', $this.text())
    var level = parseInt(this.tagName.replace(/H/, ''))
    var indent = ''
    for (var i = 0; i < level - 2; i++) {
      indent += '　'
    }
    $toc.append([indent, '<a href="#', $this.text(), '">', $this.text(), '</a><br>'].join(''))
  })
  $('table').before('<h2>目次</h2>')
  $('table').before($toc)
})
