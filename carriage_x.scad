use </mnt/d/RepRap/Work/CoreXY-n/timing_belts.scad>


difference() {
	difference() {
		difference() {
			difference() {
				difference() {
					difference() {
						difference() {
							difference() {
								difference() {
									difference() {
										difference() {
											difference() {
												union() {
													union() {
														union() {
															translate(v = [0, 0, -6.0000000000]) {
																cube(center = true, size = [63.0000000000, 49.0000000000, 12.0000000000]);
															}
															rotate(a = [0, 0, 0]) {
																translate(v = [21.5000000000, 0, 0]) {
																	translate(v = [0, 2.0000000000, -1]) {
																		cube(size = [10, 22.5000000000, 8.5000000000]);
																	}
																}
															}
														}
														rotate(a = [0, 0, 180]) {
															translate(v = [21.5000000000, 0, 0]) {
																translate(v = [0, 2.0000000000, -1]) {
																	cube(size = [10, 22.5000000000, 8.5000000000]);
																}
															}
														}
													}
													union() {
														translate(v = [-31.5000000000, -24.5000000000, -1]) {
															cube(size = [63.0000000000, 3, 10.9000000000]);
														}
														translate(v = [21.5000000000, -24.5000000000, -1]) {
															cube(size = [10, 10, 8.5000000000]);
														}
													}
												}
												translate(v = [15.5200000000, 0, 5.5800000000]) {
													rotate(a = [90, 0, 0]) {
														cylinder($fn = 16, center = true, h = 98.0000000000, r = 1.7000000000);
													}
												}
											}
											translate(v = [-15.5200000000, 0, 5.5800000000]) {
												rotate(a = [90, 0, 0]) {
													cylinder($fn = 16, center = true, h = 98.0000000000, r = 1.7000000000);
												}
											}
										}
										translate(v = [0, 15.0000000000, -12.0000000000]) {
											union() {
												rotate(a = [0, 90, 0]) {
													cylinder($fn = 32, center = true, h = 64.0000000000, r = 7.6000000000);
												}
												difference() {
													difference() {
														rotate(a = [45, 0, 0]) {
															cube(center = true, size = [64.0000000000, 15.2000000000, 15.2000000000]);
														}
														translate(v = [0, 0, 23.3000000000]) {
															cube(center = true, size = [65.0000000000, 30.4000000000, 30.4000000000]);
														}
													}
													translate(v = [0, 0, -9.8260400000]) {
														cube(center = true, size = [65.0000000000, 30.4000000000, 30.4000000000]);
													}
												}
											}
										}
									}
									translate(v = [0, -15.0000000000, -12.0000000000]) {
										union() {
											rotate(a = [0, 90, 0]) {
												cylinder($fn = 32, center = true, h = 64.0000000000, r = 7.6000000000);
											}
											difference() {
												difference() {
													rotate(a = [45, 0, 0]) {
														cube(center = true, size = [64.0000000000, 15.2000000000, 15.2000000000]);
													}
													translate(v = [0, 0, 23.3000000000]) {
														cube(center = true, size = [65.0000000000, 30.4000000000, 30.4000000000]);
													}
												}
												translate(v = [0, 0, -9.8260400000]) {
													cube(center = true, size = [65.0000000000, 30.4000000000, 30.4000000000]);
												}
											}
										}
									}
								}
								translate(v = [19.4000000000, 15.0000000000, -12.0000000000]) {
									rotate(a = [0, 90, 0]) {
										difference() {
											cylinder(center = true, h = 4, r = 11.1000000000);
											cylinder(center = true, h = 5, r = 9.1000000000);
										}
									}
								}
							}
							translate(v = [19.4000000000, -15.0000000000, -12.0000000000]) {
								rotate(a = [0, 90, 0]) {
									difference() {
										cylinder(center = true, h = 4, r = 11.1000000000);
										cylinder(center = true, h = 5, r = 9.1000000000);
									}
								}
							}
						}
						translate(v = [-19.4000000000, 15.0000000000, -12.0000000000]) {
							rotate(a = [0, 90, 0]) {
								difference() {
									cylinder(center = true, h = 4, r = 11.1000000000);
									cylinder(center = true, h = 5, r = 9.1000000000);
								}
							}
						}
					}
					translate(v = [-19.4000000000, -15.0000000000, -12.0000000000]) {
						rotate(a = [0, 90, 0]) {
							difference() {
								cylinder(center = true, h = 4, r = 11.1000000000);
								cylinder(center = true, h = 5, r = 9.1000000000);
							}
						}
					}
				}
				rotate(a = [0, 0, 0]) {
					translate(v = [-32.5000000000, 5.0000000000, -7.5000000000]) {
						rotate(a = [0, 0, -15]) {
							translate(v = [0, 0.9000000000, 4.0000000000]) {
								gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 20);
							}
						}
					}
				}
			}
			rotate(a = [0, 0, 180]) {
				translate(v = [-32.5000000000, 5.0000000000, -7.5000000000]) {
					rotate(a = [0, 0, -15]) {
						translate(v = [0, 0.9000000000, 4.0000000000]) {
							gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 20);
						}
					}
				}
			}
		}
		rotate(a = [0, 0, 0]) {
			translate(v = [23.0000000000, 5.0000000000, 1.0000000000]) {
				translate(v = [4.7197186342, 0, 0]) {
					union() {
						union() {
							translate(v = [0, 0.9000000000, 4.0000000000]) {
								gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 12);
							}
							translate(v = [0, 4.7597186342, 0]) {
								translate(v = [-4.7197186342, 0, 0]) {
									rotate(a = [0, 0, -90.5000000000]) {
										translate(v = [0, 0.9000000000, 3.5000000000]) {
											gt2_a(a = 91, c = 0.3000000000, r = 3.8197186342, w = 7);
										}
									}
								}
							}
						}
						translate(v = [0, 16.7197186342, 0]) {
							translate(v = [-4.7197186342, 0, 0]) {
								rotate(a = [0, 0, -90]) {
									translate(v = [0, 0.9000000000, 4.0000000000]) {
										gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 12);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	rotate(a = [0, 0, 180]) {
		translate(v = [23.0000000000, 5.0000000000, 1.0000000000]) {
			translate(v = [4.7197186342, 0, 0]) {
				union() {
					union() {
						translate(v = [0, 0.9000000000, 4.0000000000]) {
							gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 12);
						}
						translate(v = [0, 4.7597186342, 0]) {
							translate(v = [-4.7197186342, 0, 0]) {
								rotate(a = [0, 0, -90.5000000000]) {
									translate(v = [0, 0.9000000000, 3.5000000000]) {
										gt2_a(a = 91, c = 0.3000000000, r = 3.8197186342, w = 7);
									}
								}
							}
						}
					}
					translate(v = [0, 16.7197186342, 0]) {
						translate(v = [-4.7197186342, 0, 0]) {
							rotate(a = [0, 0, -90]) {
								translate(v = [0, 0.9000000000, 4.0000000000]) {
									gt2_belt_len_clr(belt_width = 8.0000000000, clr = 0.3000000000, len = 12);
								}
							}
						}
					}
				}
			}
		}
	}
}
