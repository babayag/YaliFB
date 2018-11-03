if (response.student_id == 'SD0001' || response.student_id == 'SD0002' || response.student_id == 'SD0004') {  
    $scope.pdfData = true;
    $scope.StudentPDFFile =  response.student_id+'.pdf';
} else {
    $scope.pdfData = false;
}