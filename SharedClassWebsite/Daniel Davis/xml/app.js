$(document).ready(function () {
  $("#loadXml").click(function () {
    // Get XML content from textarea
    var xml = $("#xmlInput").val();

    try {
      // Convert the string into XML
      var xmlDoc = $.parseXML(xml);
      var xmlString = new XMLSerializer().serializeToString(xmlDoc);

      // Display formatted XML
      $("#xmlContent").text(xmlString);
      // Makes content editable
      $("#xmlContent").attr("contenteditable", "true");
    } catch (e) {
      $("#xmlContent").text("Invalid XML.");
      console.error("Parsing error:", e);
    }
  });
});
