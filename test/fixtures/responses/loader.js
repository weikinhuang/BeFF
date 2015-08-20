define({
  success: {
    status: 200,
    responseText: JSON.stringify({
      offset: 1,
      section_content: ['a', 'b', 'c'],
      data: ['a', 'b', 'c']
    })
  },
  error: {
    status: 500,
    responseText: ''
  },
  empty: {
    status: 200,
    responseText: JSON.stringify({
      offset: 1,
      section_content: [],
      data: []
    })
  }
});
