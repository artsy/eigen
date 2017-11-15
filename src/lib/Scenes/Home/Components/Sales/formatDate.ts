import moment from "moment"

export function liveDate(auction) {
  if (moment(auction.registration_ends_at) > moment()) {
    return formatDate(auction.registration_ends_at, false, true)
  } else if (moment(auction.live_start_at) > moment()) {
    return formatDate(auction.live_start_at)
  } else {
    return "In Progress"
  }
}

export function timedDate(auction) {
  if (moment(auction.start_at) > moment()) {
    return formatDate(auction.start_at)
  } else {
    return formatDate(auction.end_at, true)
  }
}

function formatDate(date, isStarted = false, isRegister = false) {
  let formatted
  if (isStarted) {
    formatted = moment(date).fromNow().replace("in ", "") + " left"
  } else if (isRegister) {
    if (moment().diff(moment(date), "hours") > -24) {
      formatted = "Register by\n" + moment(date).format("ha")
    } else {
      formatted = "Register by\n" + moment(date).format("MMM D, ha")
    }
  } else {
    formatted = "Live " + moment(date).fromNow()
  }
  return formatted
}
